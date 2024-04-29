import { SiteConfig } from "./site-configs.types";

// Called by ./cli.ts
export default (): SiteConfig[] => [
    {
        name: 'Comet Site "Main/DE"',
        contentScope: {
            domain: "main",
            language: "de",
        },
        domains: {
            main: "localhost:3000",
            preview: "localhost:3000",
        },
    },
    {
        name: 'Comet Site "Main/EN"',
        contentScope: {
            domain: "main",
            language: "en",
        },
        domains: {
            main: "en.localhost:3000",
            preview: "localhost:3000",
        },
    },
    {
        name: 'Comet Site "Secondary/DE"',
        contentScope: {
            domain: "secondary",
            language: "de",
        },
        domains: {
            main: "secondary-de.localhost:3000",
            preview: "localhost:3000",
        },
    },
    {
        name: 'Comet Site "Secondary/EN"',
        contentScope: {
            domain: "secondary",
            language: "en",
        },
        domains: {
            main: "secondary-en.localhost:3000",
            preview: "localhost:3000",
        },
    },
];
