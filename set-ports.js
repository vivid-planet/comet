#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ENV_FILE = path.join(__dirname, '.env');
const ENV_LOCAL_FILE = path.join(__dirname, 'demo', '.env.local');

// Port variables to offset
const PORT_VARS = [
    'API_PORT',
    'ADMIN_PORT',
    'AUTHPROXY_PORT',
    'SITE_PORT',
    'IDP_PORT',
    'POSTGRESQL_PORT',
    'IMGPROXY_PORT',
    'JAEGER_UI_PORT',
    'JAEGER_OLTP_PORT',
];

// URL/address variables whose values reference port variables and must be rewritten
const URL_VARS = [
    'IMGPROXY_URL',
    'AUTHPROXY_URL',
    'ADMIN_URL',
    'ADMIN_URL_INTERNAL',
    'API_URL',
    'POST_LOGOUT_REDIRECT_URI',
    'IDP_SSO_URL',
    'IDP_JWKS_URI',
    'IDP_END_SESSION_ENDPOINT',
    'SITE_URL',
    'OAUTH2_PROXY_OIDC_ISSUER_URL',
    'OAUTH2_PROXY_UPSTREAMS',
    'OAUTH2_PROXY_REDIRECT_URL',
    'OAUTH2_PROXY_HTTP_ADDRESS',
    'BREVO_REDIRECT_URL_FOR_IMPORT',
];

/**
 * Minimal .env parser: handles quoted values and strips inline comments.
 * Does not expand variable references — that is done separately.
 */
function parseEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return {};
    const env = {};
    for (const line of fs.readFileSync(filePath, 'utf-8').split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        let value = trimmed.slice(eqIdx + 1);
        if (value.startsWith('"') || value.startsWith("'")) {
            const quote = value[0];
            const endIdx = value.lastIndexOf(quote);
            value = endIdx > 0 ? value.slice(1, endIdx) : value.slice(1);
        } else {
            // Strip trailing inline comment (space + #)
            const commentIdx = value.indexOf(' #');
            if (commentIdx !== -1) value = value.slice(0, commentIdx);
            value = value.trim();
        }
        env[key] = value;
    }
    return env;
}

/**
 * Expand $VAR, ${VAR}, and ${VAR:-default} references using the given map.
 */
function expandValue(value, env) {
    return value.replace(/\$\{([^}]+)\}|\$([A-Za-z_][A-Za-z0-9_]*)/g, (match, braced, simple) => {
        if (braced) {
            const sepIdx = braced.indexOf(':-');
            if (sepIdx !== -1) {
                const name = braced.slice(0, sepIdx);
                const def = braced.slice(sepIdx + 2);
                return name in env ? String(env[name]) : def;
            }
            return braced in env ? String(env[braced]) : match;
        }
        return simple in env ? String(env[simple]) : match;
    });
}

/**
 * Iteratively expand all variable references in the map until stable.
 * Handles chains like A=$B, B=$C, C=value.
 */
function expandAll(envMap) {
    const result = Object.fromEntries(Object.entries(envMap).map(([k, v]) => [k, String(v)]));
    let changed = true;
    while (changed) {
        changed = false;
        for (const key of Object.keys(result)) {
            if (!result[key].includes('$')) continue;
            const expanded = expandValue(result[key], result);
            if (expanded !== result[key]) {
                result[key] = expanded;
                changed = true;
            }
        }
    }
    return result;
}

/**
 * Format a value for writing to a .env file.
 * Values containing backslashes, quotes, or shell-special characters are double-quoted.
 * Backslashes inside quoted values are escaped so dotenv round-trips them correctly.
 */
function formatValue(value) {
    if (/[\\"|'`$^!;&<>(){}*?\s]/.test(value)) {
        return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
    }
    return value;
}

// --- Main ---

const offset = parseInt(process.argv[2], 10);
if (isNaN(offset)) {
    console.error('Usage: pnpm run set-ports -- <offset>');
    console.error('  offset  Integer added to every port number');
    console.error('');
    console.error('Examples:');
    console.error('  pnpm run set-ports -- 100   # shift all ports by +100');
    console.error('  pnpm run set-ports -- 0     # reset to values from .env');
    process.exit(1);
}

const rawEnv = parseEnvFile(ENV_FILE);

// Read existing .env.local and preserve user-managed keys
const MANAGED_KEYS = new Set([...PORT_VARS, ...URL_VARS]);
const existingLocal = parseEnvFile(ENV_LOCAL_FILE);
const userEntries = Object.entries(existingLocal).filter(([k]) => !MANAGED_KEYS.has(k));

// Compute new port values
const newPorts = {};
for (const portVar of PORT_VARS) {
    if (!(portVar in rawEnv)) {
        console.error(`Error: ${portVar} is not defined in .env`);
        process.exit(1);
    }
    const base = parseInt(rawEnv[portVar], 10);
    if (isNaN(base)) {
        console.error(`Error: ${portVar} in .env is not a valid integer ("${rawEnv[portVar]}")`);
        process.exit(1);
    }
    newPorts[portVar] = base + offset;
}

// Resolve all URL/address variables using the new port values
const expanded = expandAll({ ...rawEnv, ...newPorts });

// Build .env.local content
const lines = ['# override for local env', ''];
if (userEntries.length > 0) {
    lines.push('# Custom settings (preserved by set-ports.js — edit freely)', '');
    for (const [k, v] of userEntries) lines.push(`${k}=${formatValue(v)}`);
    lines.push('');
}
if (offset !== 0) {
    lines.push(
        `# Generated by set-ports.js (offset: ${offset >= 0 ? '+' : ''}${offset}) — do not edit manually`,
        '',
        '# Ports',
        ...PORT_VARS.map((v) => `${v}=${newPorts[v]}`),
        '',
        '# URLs',
        ...URL_VARS.filter((v) => v in expanded).map((v) => `${v}=${formatValue(expanded[v])}`),
        '',
    );
}

fs.writeFileSync(ENV_LOCAL_FILE, lines.join('\n'));

// Print summary
const maxLen = Math.max(...PORT_VARS.map((v) => v.length));
console.log(`\nPort offset: ${offset >= 0 ? '+' : ''}${offset}\n`);
for (const portVar of PORT_VARS) {
    if (!(portVar in newPorts)) continue;
    const base = parseInt(rawEnv[portVar], 10);
    console.log(`  ${portVar.padEnd(maxLen)}  ${String(base).padStart(5)} → ${newPorts[portVar]}`);
}
if (offset === 0) {
    console.log('\nPorts reset to .env defaults — generated section removed from demo/.env.local.');
} else {
    console.log('\nWritten to demo/.env.local');
}
