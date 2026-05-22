import { readFile } from "node:fs/promises";
import { glob } from "node:fs/promises";
import libCoverage from "istanbul-lib-coverage";
import libReport from "istanbul-lib-report";
import reports from "istanbul-reports";

const coverageMap = libCoverage.createCoverageMap({});
const sources = [];

for await (const file of glob("packages/**/coverage/coverage-final.json")) {
    sources.push(file);
}
sources.sort();

if (sources.length === 0) {
    console.error("No coverage-final.json files found. Run `pnpm test:coverage` first.");
    process.exit(1);
}

for (const file of sources) {
    const data = JSON.parse(await readFile(file, "utf8"));
    coverageMap.merge(data);
    console.log(`merged: ${file}`);
}

const context = libReport.createContext({
    dir: "coverage",
    defaultSummarizer: "nested",
    coverageMap,
});

reports.create("html", { skipEmpty: false }).execute(context);
reports.create("lcov").execute(context);
reports.create("text-summary").execute(context);

console.log("\nMerged report written to coverage/index.html");
