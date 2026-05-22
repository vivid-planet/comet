import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";

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

console.log("## Coverage report");
console.log("");
console.log(
    `**Overall:** ${formatPercentage(overall.lines)} lines · ${formatPercentage(overall.statements)} statements · ${formatPercentage(overall.branches)} branches · ${formatPercentage(overall.functions)} functions`,
);
console.log("");
console.log("| Package | Lines | Statements | Branches | Functions |");
console.log("| --- | ---: | ---: | ---: | ---: |");
for (const row of rows) {
    console.log(
        `| \`${row.package}\` | ${formatPercentage(row.lines)} | ${formatPercentage(row.statements)} | ${formatPercentage(row.branches)} | ${formatPercentage(row.functions)} |`,
    );
}
console.log("");
console.log("Download the `coverage-report` artifact from this run for the full clickable HTML report.");
