/* eslint-disable no-console */
import { execSync } from "child_process";
import { Command } from "commander";
import * as fs from "fs";
import * as os from "os";

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

export const downloadOAuth2ProxyCommand = new Command("download-oauth2-proxy")
    .description("Download the OAuth2 Proxy binary")
    .requiredOption("-v, --version <version>", "Specify the version of the OAuth2 Proxy to download (semver, e.g. >=7.0.0 <8.0.0).")
    .action(async (options) => {
        console.log("=== Installing oauth2-proxy ===");

        const version = options.version;
        const platform = getPlatform();
        const architecture = getArchitecture();
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
            execSync(
                `curl -s -L https://github.com/oauth2-proxy/oauth2-proxy/releases/download/${version}/oauth2-proxy-${version}.${platform}-${architecture}.tar.gz | tar xvfz -  -C ${baseDir}`,
                { stdio: "inherit" },
            );
        }

        // Create symlink to have a consistent name
        console.log(`Create symlink to oauth2-proxy binary on ${baseDir}/.bin/oauth2-proxy`);
        execSync(`ln -sf ../${dirname}/oauth2-proxy ${baseDir}/.bin/oauth2-proxy`);
        console.log("=== Finished installing OAuth2-Proxy ===");
    });
