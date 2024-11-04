import { SiteConfig } from "./site-configs.d";

// Called by `npx @comet/cli inject-site-configs`
export default (): SiteConfig[] => [
    {
        name: "Comet Site Main",
        domains: {
            main: "localhost:3000",
        },
        public: {
            scope: {
                domain: "main",
                languages: ["en", "de"],
            },
        },
    },
    {
        name: "Comet Site Secondary",
        domains: {
            main: "localhost:3001",
        },
        public: {
            scope: {
                domain: "secondary",
                languages: ["en", "de"],
            },
        },
    },
];
