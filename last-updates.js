import { readFile } from "fs/promises";
import { join, relative } from "path";
import { readdir, stat } from "fs/promises";
import packageJson from "package-json";
import semver from "semver";

const getAllPackageJsonPaths = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });
    const paths = [];

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory() && entry.name !== "node_modules") {
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
        const depNames = Object.keys(deps);
        if (depNames.length > 0) {
            console.log(`🔍 ${relative(process.cwd(), filePath)} has ${depNames.length} deps`);
        }
        return deps;
    } catch (e) {
        console.warn(`⚠️ Failed to read ${filePath}: ${e.message}`);
        return {};
    }
};

const main = async () => {
    const root = process.cwd();
    const allPackageJsonPaths = await getAllPackageJsonPaths(root);

    const allDeps = new Map();

    for (const path of allPackageJsonPaths) {
        const deps = await readDependenciesFromPackageJson(path);
        for (const [dep, version] of Object.entries(deps)) {
            if (!dep.startsWith('.') && !dep.startsWith('@your-org/')) {
                allDeps.set(dep, version);
            }
        }
    }

    console.log(`\n📦 Found ${allDeps.size} unique dependencies\n`);

    const results = [];

    for (const [dep, localVersion] of allDeps.entries()) {
        try {
            console.log(`⬇️  Fetching ${dep}...`);
            const info = await packageJson(dep, { fullMetadata: true });
            const latestVersion = info.version;
            const latestDate = info.time?.[latestVersion] || null;
            const satisfies = semver.validRange(localVersion) && semver.satisfies(latestVersion, localVersion);

            results.push({
                name: dep,
                localVersion,
                latestVersion,
                latestDate,
                satisfies,
            });
        } catch (err) {
            console.error(`❌ Failed to fetch ${dep}: ${err.message}`);
        }
    }

    console.log(`\n📋 Sorted results by latest release date:\n`);
    results
        .filter(r => r.latestDate)
        .sort((a, b) => new Date(b.latestDate) - new Date(a.latestDate))
        .forEach(r => {
            const status = r.satisfies ? '✅ Up-to-date' : '⚠️ Outdated';
            console.log(`${r.name}: ${r.localVersion} → ${r.latestVersion} (${r.latestDate}) ${status}`);
        });

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    const counts = {
        upToDate: 0,
        outdated: 0,
        notMaintained: 0,
        outdatedAndUnmaintained: 0,
    };

    for (const r of results) {
        if (!r.latestDate) continue;
        const isOld = new Date(r.latestDate) < oneYearAgo;

        if (r.satisfies && !isOld) {
            counts.upToDate++;
        } else if (!r.satisfies && !isOld) {
            counts.outdated++;
        } else if (r.satisfies && isOld) {
            counts.notMaintained++;
        } else if (!r.satisfies && isOld) {
            counts.outdatedAndUnmaintained++;
        }
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const maxBarWidth = 30;
    const maxCount = Math.max(...Object.values(counts));
    const bar = (n) => '█'.repeat(Math.round((n / maxCount) * maxBarWidth));

    console.log(`\n📊 Dependency Health Metrics:`);

    console.log(`
✅ Up-to-date:
    - Local version satisfies latest published version
    - Package was updated within the last year

⚠️ Outdated:
    - Local version does NOT satisfy latest version
    - But package has been updated within the last year

💤 Not maintained:
    - Local version satisfies latest version
    - BUT latest version is older than 1 year

❌ Outdated & unmaintained:
    - Local version is outdated
    - AND the latest published version is over 1 year old
`);

    console.log(`📦 Dependency Health Summary:\n`);

    for (const [label, count] of Object.entries(counts)) {
        const labelText = {
            upToDate: "✅ Up-to-date",
            outdated: "⚠️ Outdated",
            notMaintained: "💤 Not maintained",
            outdatedAndUnmaintained: "❌ Outdated & unmaintained",
        }[label];

        const percent = ((count / total) * 100).toFixed(1).padStart(5, ' ');
        console.log(`${labelText.padEnd(32)} ${bar(count).padEnd(maxBarWidth)} ${percent}% (${count})`);
    }

    console.log(`\n📦 Total: ${total} dependencies\n`);
};

main();