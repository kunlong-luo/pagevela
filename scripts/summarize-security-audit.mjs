// Summarize pnpm's read-only registry audit without treating known findings as a CI build failure.
// Invalid/unavailable audit data *is* a job failure. The complete JSON remains a workflow artifact.
import { readFileSync, appendFileSync } from 'node:fs';

const [file, rawExit] = process.argv.slice(2);
if (!file || !/^\d+$/.test(rawExit ?? '')) {
  throw new Error('Usage: node scripts/summarize-security-audit.mjs <report.json> <audit-exit-code>');
}

const auditExit = Number(rawExit);
let report;
try {
  report = JSON.parse(readFileSync(file, 'utf8'));
} catch (error) {
  throw new Error(`Registry audit did not produce valid JSON (pnpm exit ${auditExit}): ${error.message}`);
}

if (!report || typeof report !== 'object' || report.error ||
    (!Object.hasOwn(report, 'advisories') && !Object.hasOwn(report, 'vulnerabilities'))) {
  throw new Error('Registry audit returned an error or an unrecognized advisory schema');
}

const source = report.advisories ?? report.vulnerabilities;
if (typeof source !== 'object' || source === null) {
  throw new Error('Registry audit returned an invalid advisories collection');
}

const rank = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 };
const advisories = Object.values(source).map((item) => {
  const vuln = item.via && Array.isArray(item.via)
    ? item.via.find((entry) => typeof entry === 'object') ?? item
    : item;
  const url = String(vuln.url ?? item.url ?? '');
  const id = url.match(/GHSA-[a-z0-9-]+/i)?.[0] ??
    String(vuln.ghsaId ?? vuln.ghsa_id ?? item.id ?? 'unknown');
  return {
    package: String(item.module_name ?? item.name ?? vuln.name ?? 'unknown'),
    severity: String(item.severity ?? vuln.severity ?? 'unknown').toLowerCase(),
    id,
    url,
    affected: String(item.vulnerable_versions ?? item.range ?? vuln.range ?? 'unknown'),
    patched: String(item.patched_versions ?? vuln.patched_versions ?? 'unknown'),
  };
}).sort((a, b) => (rank[a.severity] ?? 5) - (rank[b.severity] ?? 5) ||
    a.package.localeCompare(b.package));

if (auditExit !== 0 && !(auditExit === 1 && advisories.length > 0)) {
  throw new Error(`pnpm audit failed without a usable set of advisories (exit ${auditExit})`);
}

const sanitize = (value) => String(value).replace(/[\r\n|<>]/g, ' ').slice(0, 240);
const counts = advisories.reduce((acc, entry) => {
  acc[entry.severity] = (acc[entry.severity] ?? 0) + 1;
  return acc;
}, {});

const lines = [
  '## Pagevela dependency security inventory (registry audit)',
  '',
  `**Result:** ${advisories.length} advisory record(s). This is a registry inventory, **not** confirmation that all GitHub Dependabot alerts are closed.`,
  `**pnpm exit:** ${auditExit} (exit 1 means advisories were found).`,
  `**Severity:** ${Object.entries(counts).map(([level, total]) => `${level}: ${total}`).join(', ') || 'none'}.`,
  '',
  '| Package | Severity | Advisory | Affected | Patched |',
  '| --- | --- | --- | --- | --- |',
  ...advisories.slice(0, 60).map((a) =>
    `| ${sanitize(a.package)} | ${sanitize(a.severity)} | ${sanitize(a.id)} | ${sanitize(a.affected)} | ${sanitize(a.patched)} |`),
];
if (advisories.length > 60) {
  lines.push('', `Showing first 60 of ${advisories.length} entries; download the JSON artifact for the complete inventory.`);
}
const summary = lines.join('\n') + '\n';
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
}
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `findings=${advisories.length}\n`);
}
if (advisories.length > 0) {
  console.log(`::warning::pnpm registry audit reports ${advisories.length} advisory record(s); review the step summary and artifact. Do not assume a clean dependency graph.`);
} else {
  console.log('Registry audit returned zero advisories; GitHub private alert inventory still requires separate review.');
}
