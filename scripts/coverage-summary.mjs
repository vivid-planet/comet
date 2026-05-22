import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

const BADGE_WARN_THRESHOLD = 50;
const BADGE_OK_THRESHOLD = 75;

const summaryFiles = [];
for await (const entry of glob("packages/**/coverage/coverage-summary.json")) {
    summaryFiles.push(entry);
}
summaryFiles.sort();

if (summaryFiles.length === 0) {
    console.log("## Coverage report\n\nNo coverage reports found.");
    process.exit(0);
}

const totals = {
    lines: { covered: 0, total: 0 },
    statements: { covered: 0, total: 0 },
    branches: { covered: 0, total: 0 },
    functions: { covered: 0, total: 0 },
};
const rows = [];

const percentage = (covered, total) => (total === 0 ? 100 : (covered / total) * 100);
const formatPercentage = (value) => `${value.toFixed(2)}%`;
const badgeColor = (value) => {
    if (value >= BADGE_OK_THRESHOLD) return "brightgreen";
    if (value >= BADGE_WARN_THRESHOLD) return "yellow";
    return "critical";
};

for (const file of summaryFiles) {
    const packagePath = file.replace(/^packages\//, "").replace(/\/coverage\/coverage-summary\.json$/, "");
    const summary = JSON.parse(await readFile(file, "utf8")).total;

    for (const metric of ["lines", "statements", "branches", "functions"]) {
        totals[metric].covered += summary[metric].covered;
        totals[metric].total += summary[metric].total;
    }

    rows.push({
        package: packagePath,
        lines: percentage(summary.lines.covered, summary.lines.total),
        statements: percentage(summary.statements.covered, summary.statements.total),
        branches: percentage(summary.branches.covered, summary.branches.total),
        functions: percentage(summary.functions.covered, summary.functions.total),
    });
}

const overall = {
    lines: percentage(totals.lines.covered, totals.lines.total),
    statements: percentage(totals.statements.covered, totals.statements.total),
    branches: percentage(totals.branches.covered, totals.branches.total),
    functions: percentage(totals.functions.covered, totals.functions.total),
};

const metricBadge = (value, { label = "" } = {}) => {
    const encodedValue = encodeURIComponent(formatPercentage(value));
    const encodedLabel = encodeURIComponent(label);
    return `![${formatPercentage(value)}](https://img.shields.io/badge/${encodedLabel}-${encodedValue}-${badgeColor(value)}?style=flat)`;
};

console.log(metricBadge(overall.lines, { label: "Code Coverage" }));
console.log("");
console.log("## Coverage report");
console.log("");
console.log("| Package | Lines | Statements | Branches | Functions |");
console.log("| --- | :---: | :---: | :---: | :---: |");
for (const row of rows) {
    console.log(
        `| \`packages/${row.package}\` | ${metricBadge(row.lines)} | ${metricBadge(row.statements)} | ${metricBadge(row.branches)} | ${metricBadge(row.functions)} |`,
    );
}
console.log(
    `| **Overall** | ${metricBadge(overall.lines)} | ${metricBadge(overall.statements)} | ${metricBadge(overall.branches)} | ${metricBadge(overall.functions)} |`,
);
console.log("");
console.log("Download the `coverage-report` artifact from this run for the full clickable HTML report.");
