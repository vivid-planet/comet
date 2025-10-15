import { execSync } from "child_process";
import * as fs from "fs";
import fetch from "node-fetch";

async function downloadLatestOAuth2ProxyBinary() {
    const url = "https://api.github.com/repos/oauth2-proxy/oauth2-proxy/releases/latest";

    try {
        console.log("=== Installing oauth2-proxy ===");

        // Get latest version from GitHub API
        const response = await fetch(url, {
            headers: {
                "User-Agent": "node.js", // required by GitHub API
                Accept: "application/vnd.github.v3+json",
            },
        });
        if (!response.ok) throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        const data = (await response.json()) as { tag_name: string } | undefined;
        if (!data?.tag_name) throw new Error("Could not determine latest version");

        const version = data.tag_name;
        const platform = execSync("uname -s").toString().toLowerCase().trim();
        const architecture = execSync("uname -m").toString().trim();

        // Delete old versions
        const dirname = `oauth2-proxy-${version}.${platform}-${architecture}`;
        const existingFiles = fs.readdirSync("./").filter((f) => f.startsWith("oauth2-proxy-v") && f !== dirname);
        for (const file of existingFiles) {
            console.log(`Deleting old version: ${file}`);
            fs.rmSync(file, { recursive: true, force: true });
        }

        // Download and extract new version if not already present
        const filename = `./${dirname}/oauth2-proxy`;
        if (fs.existsSync(filename)) {
            console.log(`OAuth2-Proxy version ${version} already installed.`);
        } else {
            console.log(`Downloading and extracting OAuth2-Proxy version ${version}...`);
            const downloadUrl = `https://github.com/oauth2-proxy/oauth2-proxy/releases/download/${version}/oauth2-proxy-${version}.${platform}-${architecture}.tar.gz`;
            execSync(`curl -s -L ${downloadUrl} | tar xvf -`, { stdio: "inherit" });
        }

        // Create symlink to have a consistent name
        console.log("Create symlink to oauth2-proxy binary");
        execSync(`ln -sf ${filename} ./oauth2-proxy`);
        console.log("=== Finished installing OAuth2-Proxy ===");
    } catch (error) {
        console.error("Error:", (error as Error).message);
        process.exit(1);
    }
}

downloadLatestOAuth2ProxyBinary();
