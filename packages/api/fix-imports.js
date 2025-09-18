#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(fullPath, callback);
        } else if (entry.isFile() && fullPath.endsWith(".ts")) {
            callback(fullPath);
        }
    });
}

function shouldAppendJs(importPath) {
    // Skip if it already ends with .js or .json
    if (/\.(js|json)$/.test(importPath)) return false;

    // Criteria:
    // 1) relative path (starts with ./ or ../)
    if (/^\.\.?\//.test(importPath)) return true;

    // 2) src alias
    if (/^src\//.test(importPath)) return true;

    // 3) any path containing at least two slashes
    const slashCount = (importPath.match(/\//g) || []).length;
    if (slashCount >= 2) return true;

    return false;
}

function addJs(importPath) {
    return `${importPath}.js`;
}

function fixImports(filePath) {
    let content = fs.readFileSync(filePath, "utf8");
    let changed = false;

    // Match groups of different import styles:
    // 1) import ... from "PATH"
    // 2) export ... from "PATH"
    // 3) side-effect: import "PATH"
    // 4) dynamic: import("PATH")
    //
    // Captured groups:
    // - kind: import/export/import(  (for dynamic)
    // - quote: the quote character
    // - path: the import path
    const pattern =
        /\b(?:import(?:\s+type)?\s+[^'"]*?\sfrom\s|export\s+[^'"]*?\sfrom\s)\s*(['"])([^'"]+)\1|\bimport\s*\(\s*(['"])([^'"]+)\3\s*\)|\bimport\s+(['"])([^'"]+)\5/g;

    const newContent = content.replace(pattern, (match, q1, p1, q2, p2, q3, p3) => {
        // Determine which alternative matched and extract quote/path
        let quote = q1 || q2 || q3;
        let importPath = p1 || p2 || p3;

        if (!shouldAppendJs(importPath)) return match;

        changed = true;
        const updated = `${quote}${addJs(importPath)}${quote}`;

        // Reconstruct based on which branch matched by mirroring the original text structure
        if (q1) {
            // import/export ... from "PATH"
            return match.replace(`${quote}${importPath}${quote}`, updated);
        } else if (q2) {
            // dynamic import("PATH")
            return match.replace(`${quote}${importPath}${quote}`, updated);
        } else {
            // side-effect import "PATH"
            return match.replace(`${quote}${importPath}${quote}`, updated);
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, newContent, "utf8");
        console.log(`Updated imports in: ${filePath}`);
    }
}

const targetDir = process.argv[2] || process.cwd();
walkDir(targetDir, fixImports);
