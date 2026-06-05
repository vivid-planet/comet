#!/usr/bin/env node
// Discover which workspace packages are affected by the current change and
// emit GitHub Actions matrix outputs.
//
// Usage:  node .github/scripts/discover.mjs <base-sha>
//
// Outputs (via $GITHUB_OUTPUT):
//   run-all                 — true if an "infrastructure" file changed (forces full matrix)
//   any-affected            — true if at least one workspace package is affected
//   lint-matrix             — JSON array of { package, slug } for the lint matrix
//   test-unit-matrix        — JSON array for the test:unit matrix
//   test-storybook-matrix   — JSON array for the test:storybook matrix
//   chromatic-needed        — true if any package Chromatic publishes is affected

import { execSync } from "node:child_process";
import { readFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const baseSha = process.argv[2];
if (!baseSha) {
    console.error("usage: discover.mjs <base-sha>");
    process.exit(2);
}

// Files that, when changed, force a full matrix run.
const INFRA_PATTERN =
    /^(pnpm-lock\.yaml|package\.json|tsconfig.*\.json|\.github\/(workflows|actions)\/|knip\.json|lint-staged\.config\.|copy-project-files\.js|\.prettierrc|\.editorconfig)/;

// Packages published to Chromatic — if any are affected, run the chromatic job.
const CHROMATIC_PACKAGES = ["@comet/admin", "@comet/cms-admin", "@comet/mail-react"];

const changedFiles = execSync(`git diff --name-only ${baseSha}...HEAD`, { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);

console.log("Changed files:");
changedFiles.forEach((f) => console.log(`  ${f}`));

const runAll = changedFiles.some((f) => INFRA_PATTERN.test(f));
if (runAll) console.log("→ infrastructure change detected, will run full matrix");

const filter = runAll ? "*" : `...[${baseSha}]`;
const paths = execSync(`pnpm --silent --filter "${filter}" exec pwd`, { encoding: "utf8" })
    .trim()
    .split("\n")
    .filter(Boolean);

const packages = paths
    .map((p) => {
        try {
            const pj = JSON.parse(readFileSync(join(p, "package.json"), "utf8"));
            return { name: pj.name, scripts: pj.scripts ?? {} };
        } catch {
            return null;
        }
    })
    .filter((p) => p && p.name && p.name !== "root");

console.log(`Affected packages: ${packages.map((p) => p.name).join(", ") || "(none)"}`);

const slug = (name) => name.replace(/^@comet\//, "").replace(/^comet-/, "");
const matrixEntry = (p) => ({ package: p.name, slug: slug(p.name) });

const outputs = {
    "run-all": runAll,
    "any-affected": packages.length > 0,
    "lint-matrix": JSON.stringify(packages.filter((p) => p.scripts["lint:ci"]).map(matrixEntry)),
    "test-unit-matrix": JSON.stringify(packages.filter((p) => p.scripts["test:unit"]).map(matrixEntry)),
    "test-storybook-matrix": JSON.stringify(packages.filter((p) => p.scripts["test:storybook"]).map(matrixEntry)),
    "chromatic-needed": packages.some((p) => CHROMATIC_PACKAGES.includes(p.name)),
};

console.log("Outputs:", outputs);

if (process.env.GITHUB_OUTPUT) {
    for (const [k, v] of Object.entries(outputs)) {
        appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);
    }
}
