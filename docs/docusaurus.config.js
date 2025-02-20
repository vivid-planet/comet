// @ts-check
const { themes } = require("prism-react-renderer");

const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "COMET DXP Docs",
    tagline: "",
    url: "https://docs.comet-dxp.com",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",

    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },

    presets: [
        [
            "classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    editUrl: "https://github.com/vivid-planet/comet/edit/main/docs/",
                },
                blog: {
                    showReadingTime: true,
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: "COMET DXP",
                logo: {
                    alt: "COMET DXP logo",
                    src: "img/comet-logo.svg",
                },
                items: [
                    {
                        type: "doc",
                        docId: "Overview",
                        position: "left",
                        label: "Docs",
                    },
                    {
                        href: "https://storybook.comet-dxp.com/",
                        position: "right",
                        label: "Storybook",
                    },
                    {
                        href: "https://github.com/vivid-planet/comet",
                        position: "right",
                        label: "GitHub",
                    },
                ],
            },
            footer: {
                style: "dark",
                copyright: `Copyright © ${new Date().getFullYear()} Vivid Planet Software GmbH. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
                magicComments: [
                    {
                        className: "theme-code-block-highlighted-line",
                        line: "highlight-next-line",
                        block: { start: "highlight-start", end: "highlight-end" },
                    },
                    {
                        className: "code-block-addition-line",
                        line: "addition-next-line",
                        block: { start: "addition-start", end: "addition-end" },
                    },
                    {
                        className: "code-block-removal-line",
                        line: "removal-next-line",
                        block: { start: "removal-start", end: "removal-end" },
                    },
                ],
                additionalLanguages: ["bash", "diff", "json"],
            },
            announcementBar: {
                id: "work-in-progress",
                content: "Documentation is a work in progress",
                backgroundColor: "var(--ifm-color-warning-contrast-background)",
                textColor: "var(--ifm-color-warning-contrast-foreground)",
                isCloseable: false,
            },
            liveCodeBlock: {
                playgroundPosition: "top",
            },
            algolia: {
                appId: "KRLBC262QV",
                apiKey: "d7d66be907d32f32828bcb2344e7be6e",
                indexName: "comet-dxp",
                contextualSearch: true,
            },
            mermaid: {
                theme: { light: "neutral", dark: "dark" },
            },
        }),

    themes: ["@docusaurus/theme-live-codeblock", "@docusaurus/theme-mermaid"],
    plugins: ["./src/plugins/extend-webpack-config"],
    markdown: {
        mermaid: true,
    },
};

module.exports = config;
