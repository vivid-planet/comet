import { SiteConfig } from "./site-configs.types";

// Called by `npx @comet/cli inject-site-configs`
export default (): SiteConfig[] => [
    {
        name: 'Comet Site "Main/DE"',
        domains: {
            main: "localhost:3000",
        },
        public: {
            contentScope: {
                domain: "main",
                language: "de",
            },
        }
    },
    {
        name: 'Comet Site "Main/EN"',
        domains: {
            main: "en.localhost:3000",
        },
        public: {
            contentScope: {
                domain: "main",
                language: "en",
            },
        }
    },
    {
        name: 'Comet Site "Secondary/DE"',
        domains: {
            main: "secondary-de.localhost:3000",
        },
        public: {
            contentScope: {
                domain: "secondary",
                language: "de",
            },
        }
    },
    {
        name: 'Comet Site "Secondary/EN"',
        domains: {
            main: "secondary-en.localhost:3000",
        },
        public: {
            contentScope: {
                domain: "secondary",
                language: "en",
            },
        }
    },
];
