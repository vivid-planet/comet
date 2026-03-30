import { MjmlColumn, MjmlRaw } from "@faire/mjml-react";
import { describe, expect, it } from "vitest";

import { renderMailHtml } from "../../../server/renderMailHtml.js";
import { createTheme } from "../../../theme/createTheme.js";
import { MjmlMailRoot } from "../../mailRoot/MjmlMailRoot.js";
import { MjmlSection } from "../../section/MjmlSection.js";
import { generateHtmlTextStyles, HtmlText } from "../HtmlText.js";

function renderHtml(element: React.ReactElement): string {
    const { html } = renderMailHtml(element);
    return html;
}

function renderWithTheme(theme: ReturnType<typeof createTheme>, children: React.ReactNode): string {
    return renderHtml(
        <MjmlMailRoot theme={theme}>
            <MjmlSection>
                <MjmlColumn>
                    <MjmlRaw>
                        <table>
                            <tr>{children}</tr>
                        </table>
                    </MjmlRaw>
                </MjmlColumn>
            </MjmlSection>
        </MjmlMailRoot>,
    );
}

describe("HtmlText", () => {
    it("renders a td element with base theme styles as inline styles", () => {
        const theme = createTheme();
        const html = renderWithTheme(theme, <HtmlText>Hello</HtmlText>);

        expect(html).toContain("<td");
        expect(html).toContain("Hello");
        expect(html).toContain("font-family:Arial, sans-serif");
        expect(html).toContain("font-size:16px");
        expect(html).toContain("line-height:20px");
    });

    it("applies variant styles overriding base styles", () => {
        const theme = createTheme({
            text: {
                variants: {
                    heading: {
                        fontSize: { default: "32px", mobile: "24px" },
                        fontWeight: 700,
                    },
                },
            },
        });

        const html = renderWithTheme(theme, <HtmlText variant="heading">Title</HtmlText>);

        expect(html).toContain("font-size:32px");
        expect(html).toContain("font-weight:700");
        // Base fontFamily should still be present
        expect(html).toContain("font-family:Arial, sans-serif");
    });

    it("applies default variant when no variant prop is given", () => {
        const theme = createTheme({
            text: {
                defaultVariant: "body",
                variants: {
                    body: { fontSize: "14px" },
                },
            },
        });

        const html = renderWithTheme(theme, <HtmlText>Text</HtmlText>);

        expect(html).toContain("font-size:14px");
        expect(html).toContain("htmlText--body");
    });

    it("applies bottomSpacing as padding-bottom", () => {
        const theme = createTheme({
            text: {
                bottomSpacing: "16px",
            },
        });

        const html = renderWithTheme(theme, <HtmlText bottomSpacing>Text</HtmlText>);

        expect(html).toContain("padding-bottom:16px");
    });

    it("does not apply padding-bottom when bottomSpacing is not set", () => {
        const theme = createTheme({
            text: {
                bottomSpacing: "16px",
            },
        });

        const html = renderWithTheme(theme, <HtmlText>Text</HtmlText>);

        expect(html).not.toContain("padding-bottom");
    });

    it("applies bottomSpacing from variant", () => {
        const theme = createTheme({
            text: {
                variants: {
                    heading: {
                        bottomSpacing: { default: "24px", mobile: "16px" },
                    },
                },
            },
        });

        const html = renderWithTheme(
            theme,
            <HtmlText variant="heading" bottomSpacing>
                Title
            </HtmlText>,
        );

        expect(html).toContain("padding-bottom:24px");
    });

    it("merges user style prop over theme styles", () => {
        const theme = createTheme({
            text: { color: "black" },
        });

        const html = renderWithTheme(theme, <HtmlText style={{ color: "red" }}>Text</HtmlText>);

        // User's color should appear (last in style wins)
        expect(html).toContain("color:red");
    });

    it("merges user className via clsx", () => {
        const theme = createTheme();

        const html = renderWithTheme(theme, <HtmlText className="custom">Text</HtmlText>);

        expect(html).toContain("htmlText");
        expect(html).toContain("custom");
    });

    it("adds mso-line-height-rule when lineHeight is present", () => {
        const theme = createTheme({
            text: { lineHeight: "20px" },
        });

        const html = renderWithTheme(theme, <HtmlText>Text</HtmlText>);

        expect(html).toContain("mso-line-height-rule:exactly");
    });

    it("applies CSS class structure correctly", () => {
        const theme = createTheme({
            text: {
                variants: {
                    heading: { fontSize: "32px" },
                },
            },
        });

        const html = renderWithTheme(
            theme,
            <HtmlText variant="heading" bottomSpacing>
                Title
            </HtmlText>,
        );

        expect(html).toContain("htmlText");
        expect(html).toContain("htmlText--heading");
        expect(html).toContain("htmlText--bottomSpacing");
    });

    it("passes native td attributes through", () => {
        const theme = createTheme();

        const html = renderWithTheme(
            theme,
            <HtmlText colSpan={2} align="center">
                Text
            </HtmlText>,
        );

        expect(html).toContain('colSpan="2"');
        expect(html).toContain('align="center"');
    });

    it("produces no MJML warnings when used inside MjmlRaw", () => {
        const theme = createTheme({
            text: {
                variants: {
                    heading: {
                        fontSize: { default: "32px", mobile: "24px" },
                        fontWeight: 700,
                    },
                },
            },
        });

        const { mjmlWarnings } = renderMailHtml(
            <MjmlMailRoot theme={theme}>
                <MjmlSection>
                    <MjmlColumn>
                        <MjmlRaw>
                            <table>
                                <tr>
                                    <HtmlText variant="heading" bottomSpacing>
                                        Heading
                                    </HtmlText>
                                </tr>
                            </table>
                        </MjmlRaw>
                    </MjmlColumn>
                </MjmlSection>
            </MjmlMailRoot>,
        );

        expect(mjmlWarnings).toEqual([]);
    });
});

describe("generateHtmlTextStyles", () => {
    it("returns empty CSS when no variants are defined", () => {
        const theme = createTheme();
        const result = generateHtmlTextStyles(theme);
        expect(result).toBe("");
    });

    it("emits responsive media queries with htmlText selectors", () => {
        const theme = createTheme({
            text: {
                variants: {
                    heading: {
                        fontSize: { default: "32px", mobile: "24px" },
                    },
                },
            },
        });

        const result = generateHtmlTextStyles(theme);
        expect(result).toContain(".htmlText--heading");
        expect(result).not.toContain("> div");
        expect(result).toContain("font-size: 24px !important");
    });

    it("uses compound selector for responsive bottomSpacing", () => {
        const theme = createTheme({
            text: {
                variants: {
                    heading: {
                        bottomSpacing: { default: "24px", mobile: "16px" },
                    },
                },
            },
        });

        const result = generateHtmlTextStyles(theme);
        expect(result).toContain(".htmlText--bottomSpacing.htmlText--heading");
        expect(result).toContain("padding-bottom: 16px !important");
    });

    it("emits no media queries for non-responsive variant", () => {
        const theme = createTheme({
            text: {
                variants: {
                    body: { fontSize: "14px", lineHeight: "22px" },
                },
            },
        });

        const result = generateHtmlTextStyles(theme);
        expect(result).not.toContain("@media");
    });
});
