import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import type { Plugin } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

/**
 * Vite plugin that resolves bare module imports from monorepo workspace packages
 * by looking in the project's own node_modules when the default resolution fails.
 */
function monorepoResolvePlugin(): Plugin {
    return {
        name: "monorepo-resolve",
        enforce: "pre",
        async resolveId(source, importer, options) {
            if (!importer || source.startsWith(".") || source.startsWith("/") || source.startsWith("@src")) {
                return null;
            }
            if (!importer.includes("/packages/")) {
                return null;
            }
            const resolved = await this.resolve(source, resolve(projectRoot, "stub.js"), { ...options, skipSelf: true });
            return resolved;
        },
    };
}

/**
 * Vite plugin that stubs Node.js-only modules imported by server-side code
 * from @comet/site-nextjs that gets pulled into the bundle.
 */
function stubNodeModulesPlugin(): Plugin {
    const nodeModules = [
        "fs",
        "fs/promises",
        "path",
        "crypto",
        "stream",
        "http",
        "https",
        "url",
        "os",
        "child_process",
        "net",
        "tls",
        "util",
        "events",
        "buffer",
        "querystring",
        "zlib",
    ];
    return {
        name: "stub-node-modules",
        enforce: "pre",
        resolveId(source) {
            if (nodeModules.includes(source) || source.startsWith("node:")) {
                return { id: `\0stub:${source}`, moduleSideEffects: false };
            }
            return null;
        },
        load(id) {
            if (id.startsWith("\0stub:")) {
                // Provide a proxy that returns empty functions for any property access
                return `
                    const handler = { get: () => () => {} };
                    const stub = new Proxy({}, handler);
                    export default stub;
                    export const readFile = () => {};
                    export const readFileSync = () => "";
                    export const writeFileSync = () => {};
                    export const existsSync = () => false;
                    export const createHash = () => ({ update: () => ({ digest: () => "" }) });
                    export const resolve = (...args) => args.join("/");
                    export const join = (...args) => args.join("/");
                    export const dirname = (p) => p;
                `;
            }
            return null;
        },
    };
}

const config: StorybookConfig = {
    framework: "@storybook/react-vite",
    stories: ["../src/**/*.stories.tsx"],
    addons: ["@storybook/addon-docs"],
    viteFinal: async (config) => {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...config.resolve.alias,
            "@src": resolve(__dirname, "../src"),
        };
        config.resolve.dedupe = [...(config.resolve.dedupe || []), "react", "react-dom"];
        config.plugins = [...(config.plugins || []), monorepoResolvePlugin(), stubNodeModulesPlugin()];
        return config;
    },
};

export default config;
