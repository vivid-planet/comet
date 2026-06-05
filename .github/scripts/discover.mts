#!/usr/bin/env node
// Decide which CI matrix lanes need to run for the current change.
//
// Usage:  node .github/scripts/discover.mts <base-sha>
// Writes GITHUB_OUTPUT: run-all, any-affected, lint-matrix,
// test-unit-matrix, test-storybook-matrix, chromatic-needed.

import { execSync } from "node:child_process";
import { appendFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const INFRA_PATTERN =
    /^(pnpm-lock\.yaml|package\.json|tsconfig.*\.json|\.github\/(workflows|actions)\/|knip\.json|lint-staged\.config\.|copy-project-files\.js|\.prettierrc|\.editorconfig)/;

const CHROMATIC_PACKAGES = new Set(["@comet/admin", "@comet/cms-admin", "@comet/mail-react"]);

type Pkg = { name: string; scripts: Record<string, string> };

function sh(cmd: string): string[] {
    return execSync(cmd, { encoding: "utf8" }).trim().split("\n").filter(Boolean);
}

function loadPackage(dir: string): Pkg | null {
    try {
        const { name, scripts = {} } = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
        return name && name !== "root" ? { name, scripts } : null;
    } catch {
        return null;
    }
}

function matrix(packages: Pkg[], script: string): string {
    const entries = packages
        .filter((p) => p.scripts[script])
        .map((p) => ({ package: p.name, slug: p.name.replace(/^@comet\//, "").replace(/^comet-/, "") }));
    return JSON.stringify(entries);
}

function setOutput(key: string, value: unknown): void {
    if (process.env.GITHUB_OUTPUT) {
        appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
    }
}

function main(): void {
    const baseSha = process.argv[2];
    if (!baseSha) {
        console.error("usage: discover.mts <base-sha>");
        process.exit(2);
    }

    // 1. Did anything infrastructural change? If so we run the full matrix.
    const changedFiles = sh(`git diff --name-only ${baseSha}...HEAD`);
    const runAll = changedFiles.some((f) => INFRA_PATTERN.test(f));
    console.log("Changed files:");
    changedFiles.forEach((f) => console.log(`  ${f}`));
    if (runAll) console.log("→ infrastructure change detected, running full matrix");

    // 2. Which workspace packages are affected (incl. their dependents)?
    const filter = runAll ? "*" : `...[${baseSha}]`;
    const paths = sh(`pnpm --silent --filter "${filter}" exec pwd`);
    const packages = paths.map(loadPackage).filter((p): p is Pkg => p !== null);
    console.log(`Affected packages: ${packages.map((p) => p.name).join(", ") || "(none)"}`);

    // 3. Emit GitHub Actions outputs.
    setOutput("run-all", runAll);
    setOutput("any-affected", packages.length > 0);
    setOutput("lint-matrix", matrix(packages, "lint:ci"));
    setOutput("test-unit-matrix", matrix(packages, "test:unit"));
    setOutput("test-storybook-matrix", matrix(packages, "test:storybook"));
    setOutput("chromatic-needed", packages.some((p) => CHROMATIC_PACKAGES.has(p.name)));
}

main();
