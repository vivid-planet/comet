import { Environment, GetSiteConfig } from "./site-configs";

const host = process.env.SERVER_HOST ?? "localhost";
const port = parseInt(process.env.SITE_PORT || "3000", 10);

const envToDomainMap: Record<Environment, string> = {
    local: `${host}:${port}`,
};

export default ((env) => {
    return {
        name: "Comet Site Main",
        domains: {
            main: envToDomainMap[env],
        },
        public: {
            scope: {
                domain: "main",
                languages: ["en", "de"],
            },
        },
    };
}) satisfies GetSiteConfig;
