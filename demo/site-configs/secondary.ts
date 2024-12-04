import { Environment, GetSiteConfig } from "./site-configs";

const envToDomainMap: Record<Environment, string> = {
    local: "localhost:3001",
};

export default ((env) => {
    return {
        name: "Comet Site Secondary",
        domains: {
            main: envToDomainMap[env],
        },
        public: {
            scope: {
                domain: "secondary",
                languages: ["en", "de"],
            },
        },
    };
}) satisfies GetSiteConfig;
