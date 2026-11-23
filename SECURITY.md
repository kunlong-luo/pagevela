# Security Policy

## Supported versions

Security fixes are applied to the current `main` branch and, when applicable, the latest published stable release. Older releases are not guaranteed to receive security updates.

## Reporting a vulnerability

Please do **not** include vulnerability details, credentials, tokens, personal resume data, or reproduction secrets in a public issue.

Preferred private reporting flow:

1. Open the repository's **Security and quality** tab.
2. Open **Advisories**.
3. If **Report a vulnerability** is available, use that private form.

If GitHub does not show the private vulnerability reporting form for this repository, open a minimal public issue titled **Security contact request** with no vulnerability details. The maintainer can then establish an appropriate private channel.

When reporting privately, include when possible:

- A clear description of the issue.
- The affected version, commit, or URL.
- Minimal reproduction steps that do not expose unrelated sensitive data.
- The potential impact.
- Any suggested mitigation or fix.

The maintainer will review reports in good faith, coordinate a fix when needed, and publish an advisory when appropriate.

## Dependency security inventory

The [Security Inventory workflow](.github/workflows/security-inventory.yml) checks the frozen pnpm dependency graph with `pnpm audit --json --audit-level=low` against the npm registry. It runs on pull requests, relevant `main` pushes, a weekly schedule, and manual dispatch. The job uploads the full JSON report and writes a severity/GHSA summary.

The audit workflow is deliberately **report-only** for known findings: a successful run means the query and report completed, **not** necessarily that the findings count is zero. Registry/network/parse failures fail the job. Inspect the actual result and artifact every time. It does **not** grant access to the repository's authenticated Dependabot alerts and does not replace private vulnerability reporting.

As checked on 2026-11-23, the **merged main** [Security Inventory #45154252948](https://github.com/kunlong-luo/pagevela/actions/runs/45154252948) at commit [`93a0941`](https://github.com/kunlong-luo/pagevela/commit/93a0941afc6d782c549caa848e0798fc6509c44b) returned **0 advisory records** with exit code 0; its full JSON is retained as a workflow artifact. See the [dated acceptance ledger](docs/RELEASE_SECURITY_ACCEPTANCE_20261123.md) for the verification boundary. That is a dated snapshot, not a permanent security guarantee. [Issue #298](https://github.com/kunlong-luo/pagevela/issues/298) tracks the remaining authenticated alert review and Workbox's legacy build-only dependency compatibility.

Do not automatically run `pnpm audit --fix` or apply a global major-version override without confirming compatibility, production PWA precache content, real offline navigation, full CI, and same-SHA Pages delivery.
