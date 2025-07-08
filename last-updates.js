// monorepo-last-updates.mjs
import { readFile } from "fs/promises";
import { join, relative } from "path";
import { readdir, stat } from "fs/promises";
import packageJson from "package-json";
import semver from "semver";

const getAllPackageJsonPaths = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });
    const paths = [];

    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (entry.name === "node_modules") continue;
            const fullPath = join(dir, entry.name);
            const pkgJson = join(fullPath, "package.json");

            try {
                const stats = await stat(pkgJson);
                if (stats.isFile()) {
                    paths.push(pkgJson);
                    console.log(`📦 Found package.json: ${relative(process.cwd(), pkgJson)}`);
                }
            } catch {}

            const sub = await getAllPackageJsonPaths(fullPath);
            paths.push(...sub);
        }
    }

    return paths;
};

const readDependenciesFromPackageJson = async (filePath) => {
    try {
        const pkg = JSON.parse(await readFile(filePath, "utf8"));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        const depEntries = Object.entries(deps);
        if (depEntries.length > 0) {
            console.log(`🔍 ${relative(process.cwd(), filePath)} has ${depEntries.length} deps`);
        }
        return depEntries;
    } catch (e) {
        console.warn(`⚠️ Failed to read ${filePath}: ${e.message}`);
        return [];
    }
};

const main = async () => {
    const root = process.cwd();
    const allPackageJsonPaths = await getAllPackageJsonPaths(root);

    const allDeps = new Map();

    for (const path of allPackageJsonPaths) {
        const depEntries = await readDependenciesFromPackageJson(path);
        for (const [dep, versionRange] of depEntries) {
            if (!dep.startsWith('.') && !dep.startsWith('@comet/')) {
                if (!allDeps.has(dep)) {
                    allDeps.set(dep, versionRange);
                }
            }
        }
    }

    console.log(`\n📦 Found ${allDeps.size} unique dependencies\n`);

    const results = [];

    for (const [dep, localVersionRange] of allDeps.entries()) {
        try {
            console.log(`⬇️  Fetching ${dep}...`);
            const info = await packageJson(dep, { fullMetadata: true });
            const latestVersion = info.version ?? "unknown";
            const latestDate = info.time?.[latestVersion] ?? null;

            const isUpToDate = localVersionRange && semver.validRange(localVersionRange)
                ? semver.satisfies(latestVersion, localVersionRange)
                : null;

            results.push({
                name: dep,
                localVersionRange,
                latestVersion,
                latestDate,
                isUpToDate,
            });
        } catch (err) {
            console.error(`❌ Failed to fetch ${dep}: ${err.message}`);
        }
    }

    console.log(`\n📋 Dependency versions comparison (sorted by last release date):\n`);

    results
        .filter(r => r.latestDate) // only with a date
        .sort((a, b) => new Date(b.latestDate) - new Date(a.latestDate))
        .forEach(r => {
            const status = r.isUpToDate === null
                ? "unknown"
                : r.isUpToDate
                    ? "✅ up-to-date"
                    : "⚠️ behind";
            console.log(`${r.name}: local ${r.localVersionRange}, latest ${r.latestVersion} (published on ${r.latestDate}) → ${status}`);
        });
};

main();