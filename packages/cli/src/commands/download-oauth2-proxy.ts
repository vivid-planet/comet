/* eslint-disable no-console */
import { execSync } from "child_process";
import { Command } from "commander";
import * as fs from "fs";
import * as os from "os";
import * as semver from "semver";

function getPlatform(): string {
    const platform = os.platform();
    switch (platform) {
        case "linux":
            return "linux";
        case "darwin":
            return "darwin";
        case "win32":
            return "windows";
        default:
            throw new Error(`Unsupported platform: ${platform}`);
    }
}

function getArchitecture(): string {
    const arch = os.arch();
    switch (arch) {
        case "x64":
            return "amd64";
        case "arm64":
            return "arm64";
        default:
            throw new Error(`Unsupported architecture: ${arch}`);
    }
}

async function fetchJson<T>(url: string): Promise<T> {
    const res = await fetch(url, {
        headers: { "User-Agent": "Node.js" },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<T>;
}

interface GitHubRelease {
    tag_name: string;
    assets: { name: string; browser_download_url: string }[];
    draft: boolean;
    prerelease: boolean;
}

export const downloadOAuth2ProxyCommand = new Command("download-oauth2-proxy")
    .description("Download the OAuth2 Proxy binary")
    .requiredOption("-v, --version <version>", "Specify the version of the OAuth2 Proxy to download (semver, e.g. >=7.0.0 <8.0.0).")
    .action(async (options) => {
        console.log("=== Installing oauth2-proxy ===");

        // Get latest version from GitHub API
        console.log("Fetching release list...");
        const releases = await fetchJson<GitHubRelease[]>("https://api.github.com/repos/oauth2-proxy/oauth2-proxy/releases");
        if (!releases) throw new Error("Could not determine latest version");

        // Filter for stable releases matching the semver range
        const validReleases = releases
            .filter((r) => !r.draft && !r.prerelease)
            .filter((r) => {
                const version = semver.coerce(r.tag_name);
                return version ? semver.satisfies(version, options.version) : false;
            })
            .sort((a, b) => {
                const va = semver.coerce(a.tag_name);
                const vb = semver.coerce(b.tag_name);
                return semver.rcompare(va, vb);
            });
        if (validReleases.length === 0) {
            throw new Error(`No releases found for version range ${options.version}`);
        }
        const latest = validReleases[0];

        const version = latest.tag_name;
        const platform = getPlatform();
        const architecture = getArchitecture();

        const asset = latest.assets.find((a) => a.name.match(new RegExp(`${platform}-${architecture}.*(tar\\.gz|zip)$`, "i")));
        if (!asset) {
            throw new Error(`No matching binary found for ${platform}-${architecture} in release ${latest.tag_name}`);
        }

        const baseDir = `${process.cwd()}/node_modules`;
        const dirname = `oauth2-proxy-${version}.${platform}-${architecture}`;

        // Delete old versions
        const existingFiles = fs.readdirSync(baseDir).filter((f) => f.startsWith("oauth2-proxy-v") && f !== dirname);
        for (const file of existingFiles) {
            console.log(`Deleting old version: ${file}`);
            fs.rmSync(`${baseDir}/${file}`, { recursive: true, force: true });
        }

        // Download and extract new version if not already present
        const filename = `${baseDir}/${dirname}/oauth2-proxy`;
        if (fs.existsSync(filename)) {
            console.log(`OAuth2-Proxy version ${version} already installed.`);
        } else {
            console.log(`Downloading and extracting OAuth2-Proxy version ${version}...`);
            execSync(`curl -s -L ${asset.browser_download_url} | tar xvfz -  -C ${baseDir}`, { stdio: "inherit" });
        }

        // Create symlink to have a consistent name
        console.log(`Create symlink to oauth2-proxy binary on ${baseDir}/.bin/oauth2-proxy`);
        execSync(`ln -sf ../${dirname}/oauth2-proxy ${baseDir}/.bin/oauth2-proxy`);
        console.log("=== Finished installing OAuth2-Proxy ===");
    });
