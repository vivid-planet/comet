#!/usr/bin/env node
// Decide which CI matrix lanes need to run for the current change.
//
// Usage:  node .github/scripts/discover.mjs <base-sha>
// Writes GITHUB_OUTPUT: run-all, any-affected, lint-matrix,
// test-unit-matrix, test-storybook-matrix, chromatic-needed.

import { execSync } from "node:child_process";
import { readFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const baseSha = process.argv[2];
if (!baseSha) {
    console.error("usage: discover.mjs <base-sha>");
    process.exit(2);
}

const INFRA_PATTERN =
    /^(pnpm-lock\.yaml|package\.json|tsconfig.*\.json|\.github\/(workflows|actions)\/|knip\.json|lint-staged\.config\.|copy-project-files\.js|\.prettierrc|\.editorconfig)/;

const CHROMATIC_PACKAGES = new Set(["@comet/admin", "@comet/cms-admin", "@comet/mail-react"]);

const sh = (cmd) => execSync(cmd, { encoding: "utf8" }).trim().split("\n").filter(Boolean);
const slug = (name) => name.replace(/^@comet\//, "").replace(/^comet-/, "");

const changedFiles = sh(`git diff --name-only ${baseSha}...HEAD`);
const runAll = changedFiles.some((f) => INFRA_PATTERN.test(f));

console.log("Changed files:");
changedFiles.forEach((f) => console.log(`  ${f}`));
if (runAll) console.log("→ infrastructure change detected, running full matrix");

const paths = sh(`pnpm --silent --filter "${runAll ? "*" : `...[${baseSha}]`}" exec pwd`);

const packages = paths
    .map((p) => {
        try {
            const { name, scripts = {} } = JSON.parse(readFileSync(join(p, "package.json"), "utf8"));
            return name && name !== "root" ? { name, scripts, slug: slug(name) } : null;
        } catch {
            return null;
        }
    })
    .filter(Boolean);

console.log(`Affected packages: ${packages.map((p) => p.name).join(", ") || "(none)"}`);

const matrix = (script) =>
    JSON.stringify(packages.filter((p) => p.scripts[script]).map(({ name, slug }) => ({ package: name, slug })));

const outputs = {
    "run-all": runAll,
    "any-affected": packages.length > 0,
    "lint-matrix": matrix("lint:ci"),
    "test-unit-matrix": matrix("test:unit"),
    "test-storybook-matrix": matrix("test:storybook"),
    "chromatic-needed": packages.some((p) => CHROMATIC_PACKAGES.has(p.name)),
};

console.log("Outputs:", outputs);

if (process.env.GITHUB_OUTPUT) {
    for (const [k, v] of Object.entries(outputs)) {
        appendFileSync(process.env.GITHUB_OUTPUT, `${k}=${v}\n`);
    }
}
