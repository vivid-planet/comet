/* eslint-disable no-console */
import { Command } from "commander";
import fs from "fs";
import { resolve } from "path";

import { type BaseSiteConfig, type ExtractPrivateSiteConfig, type ExtractPublicSiteConfig } from "../site-configs.types";

export const injectSiteConfigsCommand = new Command("inject-site-configs")
    .description("Inject site-configs into a file")
    .requiredOption("-i, --in-file <file>", "The filename of a template file to inject.")
    .requiredOption("-o, --out-file <file>", "Write the injected template to a file.")
    .option("--base64", "use base64 encoding")
    .option("-f, --site-config-file <file>", "Path to ts-file which provides a default export with (env: string) => SiteConfig[]")
    .action(async (options) => {
        const configFile = `${process.cwd()}/${options.siteConfigFile || "site-configs.ts"}`;
        const getSiteConfigs: (env: string) => BaseSiteConfig[] = (await import(configFile)).default;

        console.log(`inject-site-configs: Replace site-configs in ${options.inFile}`);

        let str = fs.readFileSync(resolve(process.cwd(), options.inFile)).toString();

        const getUrlFromDomain = (domain: string): string => {
            return domain.includes("localhost") ? `http://${domain}` : `https://${domain}`;
        };

        const replacerFunctions: Record<string, (siteConfigs: BaseSiteConfig[], env: string) => unknown> = {
            private: (siteConfigs: BaseSiteConfig[], env: string): ExtractPrivateSiteConfig<BaseSiteConfig>[] =>
                siteConfigs.map((siteConfig) =>
                    (({ public: publicVars, ...rest }) => ({
                        ...publicVars,
                        ...rest,
                        url: getUrlFromDomain(siteConfig.domains.preliminary ?? siteConfig.domains.main),
                        preloginEnabled: siteConfig.preloginEnabled ?? !["prod", "local"].includes(env),
                    }))(siteConfig),
                ),
            public: (siteConfigs: BaseSiteConfig[]): ExtractPublicSiteConfig<BaseSiteConfig>[] =>
                siteConfigs.map((siteConfig) => ({
                    ...siteConfig.public,
                    name: siteConfig.name,
                    domains: siteConfig.domains,
                    preloginEnabled: siteConfig.preloginEnabled || false,
                    url: getUrlFromDomain(siteConfig.domains.preliminary ?? siteConfig.domains.main),
                })),
        };
        str = str.replace(/"({{ site:\/\/configs\/.*\/.* }})"/g, "'$1'"); // convert to single quotes
        str = await replaceAsync(str, RegExp(`{{ site://configs/(.*)/(.*) }}`, "g"), async (substr, type, env) => {
            const siteConfigs = await getSiteConfigs(env);
            console.log(`inject-site-configs: - ${substr} (${siteConfigs.length} sites)`);
            if (replacerFunctions[type] == undefined) {
                console.error(`inject-site-configs: ERROR: type must be ${Object.keys(replacerFunctions).join("|")} (got ${type})`);
                return substr;
            }
            const ret = JSON.stringify(replacerFunctions[type](siteConfigs, env));
            if (options.base64) {
                return Buffer.from(ret).toString("base64");
            }
            return ret.replace(/\\/g, "\\\\");
        });

        str = str.replace(/"({{ site:\/\/domains\/.*\/.* }})"/g, "$1"); // remove quotes in array
        str = await replaceAsync(str, /{{ site:\/\/domains\/(site|prelogin)\/(.*) }}/g, async (substr, type, env) => {
            const siteConfigs = await getSiteConfigs(env);
            console.log(`inject-site-domains: - ${substr} (${siteConfigs.length} sites)`);
            if (type === "site") {
                const filteredSiteConfigs = siteConfigs.filter((d) => !d.preloginEnabled);
                return JSON.stringify([
                    ...filteredSiteConfigs.map((d) => d.domains.main),
                    ...filteredSiteConfigs.filter((d) => d.domains.additional).flatMap((d) => d.domains.additional),
                ]);
            } else if (type === "prelogin") {
                return JSON.stringify([
                    ...siteConfigs.filter((d) => d.preloginEnabled).map((d) => d.domains.main),
                    ...siteConfigs.filter((d) => d.domains.preliminary).map((d) => d.domains.preliminary),
                ]);
            }
            throw new Error('type must be "site", "prelogin"');
        });

        fs.writeFileSync(resolve(process.cwd(), options.outFile), str);
    });

// https://stackoverflow.com/a/75205316
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const replaceAsync = async (str: string, regex: RegExp, asyncFn: (match: any, ...args: any) => Promise<any>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promises: Promise<any>[] = [];
    str.replace(regex, (match, ...args) => {
        promises.push(asyncFn(match, ...args));
        return match;
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
};
