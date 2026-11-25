#!/usr/bin/env python3
"""Verify downloaded Pagevela Release archives with Python's standard library.

Compares SHA256SUMS.txt with independently calculated digests, validates the
ZIP and TAR.GZ streams and ensures identical regular-file paths and bytes.
Does not extract files or execute anything from an untrusted archive.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import stat
import tarfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path

MAX_FILES = 10000
MAX_FILE_BYTES = 256 * 1024 * 1024
MAX_TOTAL_BYTES = 512 * 1024 * 1024
CHUNK = 1024 * 1024


class VerificationError(ValueError):
    """A published Release asset failed integrity or safety checks."""


def hash_stream(stream) -> tuple[int, str]:
    digest = hashlib.sha256()
    size = 0
    while chunk := stream.read(CHUNK):
        size += len(chunk)
        if size > MAX_FILE_BYTES:
            raise VerificationError("Expanded file exceeds 256 MiB safety limit")
        digest.update(chunk)
    return size, digest.hexdigest()


def sha256_file(path: Path) -> str:
    with path.open("rb") as stream:
        return hash_stream(stream)[1]


def normalize_path(name: str, *, directory: bool = False) -> str:
    if not name or name.startswith("/") or "\\" in name or "\x00" in name:
        raise VerificationError(f"Unsafe archive path: {name!r}")
    original = name
    while name.startswith("./"):
        name = name[2:]
    if directory:
        name = name.rstrip("/")
    if directory and name in ("", "."):
        return ""
    if (not name or name.endswith("/") or name[1:2] == ":"
            or any(part in ("", ".", "..") for part in name.split("/"))):
        raise VerificationError(f"Unsafe archive path: {original!r}")
    return name


def verify_manifest(folder: Path, version: str) -> tuple[str, str]:
    zip_name = f"pagevela-{version}.zip"
    tar_name = f"pagevela-{version}.tar.gz"
    try:
        lines = (folder / "SHA256SUMS.txt").read_text("utf-8").splitlines()
    except (OSError, UnicodeError) as exc:
        raise VerificationError("Missing or unreadable SHA256SUMS.txt") from exc
    if len(lines) != 2:
        raise VerificationError("SHA256SUMS.txt must have exactly two entries")
    expected, seen = {zip_name, tar_name}, set()
    for line in lines:
        m = re.fullmatch(
            r"([a-f0-9]{64})  (pagevela-[0-9]+\.[0-9]+\.[0-9]+\.(?:zip|tar\.gz))",
            line,
        )
        if m is None:
            raise VerificationError("Invalid SHA256SUMS entry format")
        declared, name = m.groups()
        if name not in expected or name in seen:
            raise VerificationError(f"Unexpected or duplicate manifest filename: {name}")
        seen.add(name)
        try:
            actual = sha256_file(folder / name)
        except OSError as exc:
            raise VerificationError(f"Missing or unreadable archive: {name}") from exc
        if actual != declared:
            raise VerificationError(f"SHA-256 mismatch for {name}")
    if seen != expected:
        raise VerificationError("Required archive missing from SHA256SUMS")
    return zip_name, tar_name


def add_file(files: dict[str, tuple[int, str]], name: str, stream) -> None:
    if name in files:
        raise VerificationError(f"Duplicate file in archive: {name}")
    if len(files) >= MAX_FILES:
        raise VerificationError("Archive contains over 10,000 files")
    files[name] = hash_stream(stream)
    if sum(size for size, _ in files.values()) > MAX_TOTAL_BYTES:
        raise VerificationError("Expanded archive exceeds 512 MiB")


def inspect_zip(path: Path) -> dict[str, tuple[int, str]]:
    files: dict[str, tuple[int, str]] = {}
    try:
        with zipfile.ZipFile(path) as archive:
            for info in archive.infolist():
                name = normalize_path(info.filename, directory=info.is_dir())
                if info.is_dir():
                    continue
                mode = (info.external_attr >> 16) & 0o170000
                if mode not in (0, stat.S_IFREG):
                    raise VerificationError(f"Unexpected ZIP file type: {name}")
                with archive.open(info) as stream:
                    add_file(files, name, stream)
    except (zipfile.BadZipFile, EOFError, OSError, RuntimeError) as exc:
        raise VerificationError(f"Unreadable ZIP: {exc}") from exc
    return files


def inspect_tar(path: Path) -> dict[str, tuple[int, str]]:
    files: dict[str, tuple[int, str]] = {}
    try:
        with tarfile.open(path, "r:gz") as archive:
            for member in archive:
                name = normalize_path(member.name, directory=member.isdir())
                if member.isdir():
                    continue
                if not member.isfile():
                    raise VerificationError(f"Unexpected TAR.GZ file type: {name}")
                stream = archive.extractfile(member)
                if stream is None:
                    raise VerificationError(f"Cannot read TAR.GZ member: {name}")
                with stream:
                    add_file(files, name, stream)
    except (tarfile.TarError, EOFError, OSError) as exc:
        raise VerificationError(f"Unreadable TAR.GZ: {exc}") from exc
    return files


def verify_release_assets(folder: Path, version: str) -> dict[str, object]:
    if not re.fullmatch(r"[0-9]+\.[0-9]+\.[0-9]+", version):
        raise VerificationError("Expected stable version X.Y.Z")
    zip_name, tar_name = verify_manifest(folder, version)
    zip_files = inspect_zip(folder / zip_name)
    tar_files = inspect_tar(folder / tar_name)
    if "index.html" not in zip_files:
        raise VerificationError("Missing index.html from release archives")
    if zip_files != tar_files:
        only_one = sorted(zip_files.keys() ^ tar_files.keys())
        mismatched = sorted(
            name for name in zip_files.keys() & tar_files.keys()
            if zip_files[name] != tar_files[name]
        )
        raise VerificationError(
            f"ZIP/TAR.GZ contents differ: paths={only_one[:5]}, data={mismatched[:5]}"
        )
    return {
        "version": version,
        "verified_at_utc": datetime.now(timezone.utc).isoformat(),
        "zip_sha256": sha256_file(folder / zip_name),
        "tar_gz_sha256": sha256_file(folder / tar_name),
        "files_compared": len(zip_files),
        "uncompressed_bytes_compared": sum(size for size, _ in zip_files.values()),
        "checks": [
            "manifest_sha256", "zip_crc_and_stream", "tar_gz_stream",
            "safe_archive_paths", "zip_tar_identical_contents",
        ],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--version", required=True)
    parser.add_argument("--dir", required=True, type=Path)
    parser.add_argument("--report", type=Path, help="Optional JSON report path")
    args = parser.parse_args()
    try:
        report = verify_release_assets(args.dir, args.version)
    except (VerificationError, OSError) as exc:
        print(f"Release verification FAILED: {exc}", flush=True)
        return 1
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, indent=2) + "\n", "utf-8")
    print(
        f"v{args.version}: SHA256SUMS matches; ZIP/TAR.GZ each contain "
        f"{report['files_compared']} identical files "
        f"({report['uncompressed_bytes_compared']} uncompressed bytes).",
        flush=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
