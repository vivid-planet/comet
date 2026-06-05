import { readFile } from "node:fs/promises";
import libCoverage from "istanbul-lib-coverage";

const BADGE_WARN_THRESHOLD = 50;
const BADGE_OK_THRESHOLD = 75;
const METRICS = ["lines", "statements", "branches", "functions"];

const mergedPath = "coverage/coverage-final.json";
let mergedData;
try {
    mergedData = JSON.parse(await readFile(mergedPath, "utf8"));
} catch {
    console.log("## Coverage report\n\nNo merged coverage report found. Run `pnpm coverage:report` first.");
    process.exit(0);
}

const coverageMap = libCoverage.createCoverageMap(mergedData);

const emptyMetric = () => Object.fromEntries(METRICS.map((metric) => [metric, { covered: 0, total: 0 }]));
const accumulate = (target, summary) => {
    for (const metric of METRICS) {
        target[metric].covered += summary[metric].covered;
        target[metric].total += summary[metric].total;
    }
};

const packageRegex = /\/packages\/([^/]+(?:\/[^/]+)?)\/src\//;
const packageTotals = new Map();
const overall = emptyMetric();

for (const filePath of coverageMap.files()) {
    const match = filePath.match(packageRegex);
    if (!match) continue;
    const packagePath = match[1];

    if (!packageTotals.has(packagePath)) {
        packageTotals.set(packagePath, emptyMetric());
    }
    const summary = coverageMap.fileCoverageFor(filePath).toSummary().data;
    accumulate(packageTotals.get(packagePath), summary);
    accumulate(overall, summary);
}

if (packageTotals.size === 0) {
    console.log("## Coverage report\n\nNo coverage data found in merged report.");
    process.exit(0);
}

const percentage = (covered, total) => (total === 0 ? 100 : (covered / total) * 100);
const formatPercentage = (value) => `${value.toFixed(2)}%`;
const badgeColor = (value) => {
    if (value >= BADGE_OK_THRESHOLD) return "brightgreen";
    if (value >= BADGE_WARN_THRESHOLD) return "yellow";
    return "critical";
};

const metricBadge = (value, { label = "" } = {}) => {
    const encodedValue = encodeURIComponent(formatPercentage(value));
    const encodedLabel = encodeURIComponent(label);
    return `![${formatPercentage(value)}](https://img.shields.io/badge/${encodedLabel}-${encodedValue}-${badgeColor(value)}?style=flat)`;
};

const toPercentages = (entry) => ({
    lines: percentage(entry.lines.covered, entry.lines.total),
    statements: percentage(entry.statements.covered, entry.statements.total),
    branches: percentage(entry.branches.covered, entry.branches.total),
    functions: percentage(entry.functions.covered, entry.functions.total),
});

const overallPct = toPercentages(overall);

console.log(metricBadge(overallPct.lines, { label: "Code Coverage" }));
console.log("");
console.log("## Coverage report");
console.log("");
console.log("| Package | Lines | Statements | Branches | Functions |");
console.log("| --- | :---: | :---: | :---: | :---: |");
for (const packagePath of [...packageTotals.keys()].sort()) {
    const pct = toPercentages(packageTotals.get(packagePath));
    console.log(
        `| \`packages/${packagePath}\` | ${metricBadge(pct.lines)} | ${metricBadge(pct.statements)} | ${metricBadge(pct.branches)} | ${metricBadge(pct.functions)} |`,
    );
}
console.log(
    `| **Overall** | ${metricBadge(overallPct.lines)} | ${metricBadge(overallPct.statements)} | ${metricBadge(overallPct.branches)} | ${metricBadge(overallPct.functions)} |`,
);
console.log("");
console.log("Download the `coverage-report` artifact from this run for the full clickable HTML report.");
