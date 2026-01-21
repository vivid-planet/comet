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
            return "macos";
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
            return "x86_64";
        case "arm64":
            return "arm64";
        default:
            throw new Error(`Unsupported architecture: ${arch}`);
    }
}

export const downloadMitmproxyCommand = new Command("download-mitmproxy")
    .description("Download the Mitmproxy binary")
    .requiredOption("-v, --version <version>", "Specify the version of the Mitmproxy to download (e.g. v12.2.0).")
    .action(async (options) => {
        console.log("=== Installing mitmproxy ===");

        const version = options.version;
        const platform = getPlatform();
        const architecture = getArchitecture();

        const downloadUrl = `https://downloads.mitmproxy.org/${version}/mitmproxy-${version}-${platform}-${architecture}.${platform == "windows" ? "zip" : "tar.gz"}`;

        const baseDir = `${process.cwd()}/node_modules`;
        const dirname = `mitmproxy-${version}.${platform}-${architecture}`;

        // Delete old versions
        const existingFiles = fs.readdirSync(baseDir).filter((f) => f.startsWith("mitmproxy-") && f !== dirname);
        for (const file of existingFiles) {
            console.log(`Deleting old version: ${file}`);
            fs.rmSync(`${baseDir}/${file}`, { recursive: true, force: true });
        }

        // Download and extract new version if not already present
        const filename = `${baseDir}/${dirname}`;
        if (fs.existsSync(filename)) {
            console.log(`Mitmproxy version ${version} already installed.`);
        } else {
            console.log(`Downloading and extracting Mitmproxy version ${version}...`);
            fs.mkdirSync(`${baseDir}/${dirname}`, { recursive: true });
            execSync(`curl -s -L ${downloadUrl} | tar xvfz -  -C ${baseDir}/${dirname}`, { stdio: "inherit" });
        }

        // Create symlink to have a consistent name
        console.log(`Create symlink to mitmweb binary on ${baseDir}/.bin/mitmweb`);
        if (os.platform() === "darwin") {
            execSync(`ln -sf ../${dirname}/mitmproxy.app/Contents/MacOS/mitmweb ${baseDir}/.bin/mitmweb`);
        } else {
            execSync(`ln -sf ../${dirname}/mitmweb ${baseDir}/.bin/mitmweb`);
        }
        console.log("=== Finished installing Mitmproxy ===");
    });
