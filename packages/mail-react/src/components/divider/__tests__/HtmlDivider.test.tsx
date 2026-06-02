import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createTheme } from "../../../theme/createTheme.js";
import { ThemeProvider } from "../../../theme/ThemeProvider.js";
import { generateHtmlDividerStyles, HtmlDivider } from "../HtmlDivider.js";

function renderHtmlDivider(element: React.ReactElement): string {
    return renderToStaticMarkup(element);
}

describe("HtmlDivider", () => {
    it("renders default theme styles across modern, Outlook, and legacy clients", () => {
        // The exact HTML shape is the contract: modern clients use the inline styles,
        // Outlook honors `mso-line-height-rule:exactly` with the matching `line-height`,
        // and legacy clients that ignore inline CSS fall back to the `bgcolor` / `height`
        // attributes. A snapshot locks every styling method in at once.
        const theme = createTheme();
        const html = renderHtmlDivider(
            <ThemeProvider theme={theme}>
                <HtmlDivider />
            </ThemeProvider>,
        );

        expect(html).toMatchInlineSnapshot(
            // The snapshot intentionally contains the U+200B emitted by HtmlDivider.
            // eslint-disable-next-line no-irregular-whitespace
            `"<table role="presentation" cellPadding="0" cellSpacing="0" border="0" width="100%" class="htmlDivider"><tbody><tr><td bgcolor="#000000" height="4" style="height:4px;line-height:4px;font-size:0;background-color:#000000;mso-line-height-rule:exactly">​</td></tr></tbody></table>"`,
        );
    });

    it("applies variant styles over base theme styles", () => {
        const theme = createTheme({
            divider: {
                variants: {
                    thick: { height: 10, backgroundColor: "#222222" },
                },
            },
        });

        const html = renderHtmlDivider(
            <ThemeProvider theme={theme}>
                <HtmlDivider variant="thick" />
            </ThemeProvider>,
        );

        expect(html).toContain("height:10px");
        expect(html).toContain("background-color:#222222");
        expect(html).toContain("htmlDivider--thick");
    });

    it("inherits base divider styles not overridden by variant", () => {
        const theme = createTheme({
            divider: {
                backgroundColor: "#222222",
                variants: {
                    thick: { height: 10 },
                },
            },
        });

        const html = renderHtmlDivider(
            <ThemeProvider theme={theme}>
                <HtmlDivider variant="thick" />
            </ThemeProvider>,
        );

        expect(html).toContain("height:10px");
        expect(html).toContain("background-color:#222222");
    });

    it("applies defaultVariant when no variant prop is specified", () => {
        const theme = createTheme({
            divider: {
                defaultVariant: "thin",
                variants: {
                    thin: { height: 1 },
                },
            },
        });

        const html = renderHtmlDivider(
            <ThemeProvider theme={theme}>
                <HtmlDivider />
            </ThemeProvider>,
        );

        expect(html).toContain("height:1px");
        expect(html).toContain("htmlDivider--thin");
    });

    it("per-instance height prop overrides theme and variant", () => {
        const theme = createTheme({
            divider: {
                height: 4,
                variants: { thin: { height: 1 } },
            },
        });

        const html = renderHtmlDivider(
            <ThemeProvider theme={theme}>
                <HtmlDivider variant="thin" height={12} />
            </ThemeProvider>,
        );

        expect(html).toContain("height:12px");
    });

    it("applies variant backgroundImage with the variant backgroundColor as fallback", () => {
        const theme = createTheme({
            divider: {
                variants: {
                    gradient: {
                        backgroundColor: "#5B4FC7",
                        backgroundImage: "linear-gradient(to right, red, blue)",
                    },
                },
            },
        });

        const html = renderHtmlDivider(
            <ThemeProvider theme={theme}>
                <HtmlDivider variant="gradient" />
            </ThemeProvider>,
        );

        expect(html).toContain("background-color:#5B4FC7");
        expect(html).toContain("background-image:linear-gradient(to right, red, blue)");
    });

    it("lets consumer style prop layer over theme styles", () => {
        const theme = createTheme();
        const html = renderHtmlDivider(
            <ThemeProvider theme={theme}>
                <HtmlDivider style={{ backgroundImage: "linear-gradient(to right, red, blue)" }} />
            </ThemeProvider>,
        );

        // Solid color fallback stays for clients that don't render gradients.
        expect(html).toContain("background-color:#000000");
        expect(html).toContain("background-image:linear-gradient(to right, red, blue)");
    });

    it("falls back to default styles when used without a ThemeProvider", () => {
        const html = renderHtmlDivider(<HtmlDivider />);

        expect(html).toContain("height:4px");
        expect(html).toContain("background-color:#000000");
    });

    it("throws when variant is set without a ThemeProvider", () => {
        expect(() => renderHtmlDivider(<HtmlDivider variant="thin" />)).toThrow();
    });
});

describe("generateHtmlDividerStyles", () => {
    it("returns empty CSS when no variants are defined", () => {
        const theme = createTheme();
        expect(generateHtmlDividerStyles(theme)).toBe("");
    });

    it("emits height and line-height together for responsive variants", () => {
        const theme = createTheme({
            divider: {
                variants: {
                    thin: { height: { default: 4, mobile: 2 } },
                },
            },
        });

        const result = generateHtmlDividerStyles(theme);
        expect(result).toContain(".htmlDivider--thin td");
        expect(result).toContain("height: 2px !important");
        expect(result).toContain("line-height: 2px !important");
    });

    it("emits background-color overrides for responsive variants", () => {
        const theme = createTheme({
            divider: {
                variants: {
                    accent: { backgroundColor: { default: "#5B4FC7", mobile: "#FF6B6B" } },
                },
            },
        });

        const result = generateHtmlDividerStyles(theme);
        expect(result).toContain("background-color: #FF6B6B !important");
    });

    it("emits no media queries for a non-responsive variant", () => {
        const theme = createTheme({
            divider: {
                variants: {
                    thick: { height: 8 },
                },
            },
        });

        expect(generateHtmlDividerStyles(theme)).not.toContain("@media");
    });
});
