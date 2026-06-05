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

type Pkg = {
    name: string;
    scripts: Record<string, string>;
    slug: string;
};

type MatrixEntry = {
    package: string;
    slug: string;
};

type Outputs = {
    "run-all": boolean;
    "any-affected": boolean;
    "lint-matrix": string;
    "test-unit-matrix": string;
    "test-storybook-matrix": string;
    "chromatic-needed": boolean;
};

function sh(cmd: string): string[] {
    return execSync(cmd, { encoding: "utf8" }).trim().split("\n").filter(Boolean);
}

function slug(name: string): string {
    return name.replace(/^@comet\//, "").replace(/^comet-/, "");
}

function getChangedFiles(baseSha: string): string[] {
    return sh(`git diff --name-only ${baseSha}...HEAD`);
}

function isInfraChange(changedFiles: string[]): boolean {
    return changedFiles.some((f) => INFRA_PATTERN.test(f));
}

function getAffectedPackagePaths(baseSha: string, runAll: boolean): string[] {
    const filter = runAll ? "*" : `...[${baseSha}]`;
    return sh(`pnpm --silent --filter "${filter}" exec pwd`);
}

function loadPackage(dir: string): Pkg | null {
    try {
        const { name, scripts = {} } = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
        if (!name || name === "root") return null;
        return { name, scripts, slug: slug(name) };
    } catch {
        return null;
    }
}

function buildMatrix(packages: Pkg[], script: string): string {
    const entries: MatrixEntry[] = packages.filter((p) => p.scripts[script]).map(({ name, slug }) => ({ package: name, slug }));
    return JSON.stringify(entries);
}

function buildOutputs(packages: Pkg[], runAll: boolean): Outputs {
    return {
        "run-all": runAll,
        "any-affected": packages.length > 0,
        "lint-matrix": buildMatrix(packages, "lint:ci"),
        "test-unit-matrix": buildMatrix(packages, "test:unit"),
        "test-storybook-matrix": buildMatrix(packages, "test:storybook"),
        "chromatic-needed": packages.some((p) => CHROMATIC_PACKAGES.has(p.name)),
    };
}

function writeOutputs(outputs: Outputs): void {
    if (!process.env.GITHUB_OUTPUT) return;
    for (const [key, value] of Object.entries(outputs)) {
        appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
    }
}

function main(): void {
    const baseSha = process.argv[2];
    if (!baseSha) {
        console.error("usage: discover.mts <base-sha>");
        process.exit(2);
    }

    const changedFiles = getChangedFiles(baseSha);
    const runAll = isInfraChange(changedFiles);

    console.log("Changed files:");
    changedFiles.forEach((f) => console.log(`  ${f}`));
    if (runAll) console.log("→ infrastructure change detected, running full matrix");

    const paths = getAffectedPackagePaths(baseSha, runAll);
    const packages = paths.map(loadPackage).filter((p): p is Pkg => p !== null);

    console.log(`Affected packages: ${packages.map((p) => p.name).join(", ") || "(none)"}`);

    const outputs = buildOutputs(packages, runAll);
    console.log("Outputs:", outputs);

    writeOutputs(outputs);
}

main();
