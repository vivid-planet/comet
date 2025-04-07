import { Environment, GetSiteConfig } from "./site-configs";

const envToDomainMap: Record<Environment, string> = {
    local: "localhost:3000",
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
