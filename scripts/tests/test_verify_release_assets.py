"""Offline regression tests for the independent published-archive verifier."""
import hashlib
import io
import sys
import tarfile
import tempfile
import unittest
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from verify_release_assets import VerificationError, verify_release_assets  # noqa: E402

VERSION = "2.8.4"


def write_manifest(folder):
    lines = []
    for name in (f"pagevela-{VERSION}.zip", f"pagevela-{VERSION}.tar.gz"):
        digest = hashlib.sha256((folder / name).read_bytes()).hexdigest()
        lines.append(f"{digest}  {name}")
    (folder / "SHA256SUMS.txt").write_text("\n".join(lines) + "\n", "utf-8")


def write_archives(folder, zip_files=None, tar_files=None):
    if zip_files is None:
        zip_files = {
            "index.html": b"<h1>Pagevela</h1>",
            "assets/app.js": b"console.log('ok')",
        }
    if tar_files is None:
        tar_files = zip_files
    with zipfile.ZipFile(folder / f"pagevela-{VERSION}.zip", "w") as archive:
        for name, data in zip_files.items():
            archive.writestr(name, data)
    with tarfile.open(folder / f"pagevela-{VERSION}.tar.gz", "w:gz") as archive:
        for name, data in tar_files.items():
            info = tarfile.TarInfo("./" + name)
            info.size = len(data)
            archive.addfile(info, io.BytesIO(data))
    write_manifest(folder)


class ReleaseVerifierTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.folder = Path(temp.name)
        write_archives(self.folder)

    def test_accepts_matching_archives(self):
        report = verify_release_assets(self.folder, VERSION)
        self.assertEqual(report["files_compared"], 2)
        self.assertIn("manifest_sha256", report["checks"])

    def test_rejects_changed_download_hash(self):
        (self.folder / f"pagevela-{VERSION}.zip").write_bytes(b"tampered")
        with self.assertRaisesRegex(VerificationError, "SHA-256 mismatch"):
            verify_release_assets(self.folder, VERSION)

    def test_rejects_content_mismatch_even_when_manifest_is_recalculated(self):
        write_archives(self.folder, tar_files={
            "index.html": b"<h1>different</h1>",
            "assets/app.js": b"console.log('ok')",
        })
        with self.assertRaisesRegex(VerificationError, "contents differ"):
            verify_release_assets(self.folder, VERSION)

    def test_rejects_truncated_manifest(self):
        (self.folder / "SHA256SUMS.txt").write_text("invalid\n", "utf-8")
        with self.assertRaisesRegex(VerificationError, "exactly two"):
            verify_release_assets(self.folder, VERSION)

    def test_rejects_duplicate_manifest_filename(self):
        name = f"pagevela-{VERSION}.zip"
        digest = hashlib.sha256((self.folder / name).read_bytes()).hexdigest()
        (self.folder / "SHA256SUMS.txt").write_text(
            f"{digest}  {name}\n{digest}  {name}\n", "utf-8"
        )
        with self.assertRaisesRegex(VerificationError, "duplicate"):
            verify_release_assets(self.folder, VERSION)

    def test_rejects_path_traversal_with_valid_archive_hash(self):
        write_archives(self.folder, zip_files={
            "index.html": b"<h1>safe</h1>",
            "../escape": b"evil",
        })
        with self.assertRaisesRegex(VerificationError, "Unsafe archive path"):
            verify_release_assets(self.folder, VERSION)

    def test_rejects_missing_index_html(self):
        write_archives(self.folder, zip_files={"assets/app.js": b"only file"})
        with self.assertRaisesRegex(VerificationError, "Missing index.html"):
            verify_release_assets(self.folder, VERSION)

    def test_rejects_mismatched_release_version(self):
        with self.assertRaisesRegex(VerificationError, "Unexpected"):
            verify_release_assets(self.folder, "2.8.3")

    def test_rejects_prerelease_version(self):
        with self.assertRaisesRegex(VerificationError, "stable version"):
            verify_release_assets(self.folder, "2.8.4-rc1")

    def test_rejects_tar_symlink(self):
        with tarfile.open(self.folder / f"pagevela-{VERSION}.tar.gz", "w:gz") as archive:
            info = tarfile.TarInfo("./index.html")
            info.size = 4
            archive.addfile(info, io.BytesIO(b"safe"))
            link = tarfile.TarInfo("./assets/app.js")
            link.type = tarfile.SYMTYPE
            link.linkname = "../target"
            archive.addfile(link)
        write_manifest(self.folder)
        with self.assertRaisesRegex(VerificationError, "Unexpected TAR.GZ"):
            verify_release_assets(self.folder, VERSION)


if __name__ == "__main__":
    unittest.main()
