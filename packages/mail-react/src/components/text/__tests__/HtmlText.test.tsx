import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createTheme } from "../../../theme/createTheme.js";
import { ThemeProvider } from "../../../theme/ThemeProvider.js";
import { HtmlText } from "../HtmlText.js";

function renderHtmlText(element: React.ReactElement): string {
    return renderToStaticMarkup(element);
}

describe("HtmlText", () => {
    it("renders a <td> with base theme styles as inline styles", () => {
        const theme = createTheme();
        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText>Hello</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("<td");
        expect(html).toContain("Hello");
        expect(html).toContain("font-family:Arial, sans-serif");
        expect(html).toContain("font-size:16px");
        expect(html).toContain("line-height:20px");
    });

    it("applies mso-line-height-rule when lineHeight is present", () => {
        const theme = createTheme({ text: { lineHeight: "24px" } });
        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText>Hello</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("mso-line-height-rule:exactly");
    });

    it("does not apply mso-line-height-rule when lineHeight is absent", () => {
        const theme = createTheme();
        // Override lineHeight to undefined by creating a theme without it
        theme.text.lineHeight = undefined;

        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText>Hello</HtmlText>
            </ThemeProvider>,
        );

        expect(html).not.toContain("mso-line-height-rule");
    });

    it("applies variant styles over base styles", () => {
        const theme = createTheme({
            text: {
                variants: {
                    heading: { fontSize: { default: "32px", mobile: "24px" }, fontWeight: 700 },
                },
            },
        });

        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText variant="heading">Title</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("font-size:32px");
        expect(html).toContain("font-weight:700");
    });

    it("inherits base styles not overridden by variant", () => {
        const theme = createTheme({
            text: {
                fontFamily: "Georgia, serif",
                variants: {
                    heading: { fontSize: "32px" },
                },
            },
        });

        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText variant="heading">Title</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("font-family:Georgia, serif");
        expect(html).toContain("font-size:32px");
    });

    it("applies defaultVariant when no variant prop is specified", () => {
        const theme = createTheme({
            text: {
                defaultVariant: "body",
                variants: {
                    body: { fontSize: "14px" },
                },
            },
        });

        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText>Text</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("font-size:14px");
    });

    it("applies bottomSpacing as padding-bottom", () => {
        const theme = createTheme({ text: { bottomSpacing: "16px" } });
        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText bottomSpacing>Text</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("padding-bottom:16px");
    });

    it("uses variant bottomSpacing over base", () => {
        const theme = createTheme({
            text: {
                bottomSpacing: "16px",
                variants: {
                    heading: { bottomSpacing: { default: "24px", mobile: "16px" } },
                },
            },
        });

        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText variant="heading" bottomSpacing>
                    Title
                </HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("padding-bottom:24px");
    });

    it("does not apply padding-bottom when bottomSpacing is not set", () => {
        const theme = createTheme({ text: { bottomSpacing: "16px" } });
        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText>Text</HtmlText>
            </ThemeProvider>,
        );

        expect(html).not.toContain("padding-bottom");
    });

    it("always applies the htmlText base class", () => {
        const theme = createTheme();
        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText>Hello</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain('class="htmlText"');
    });

    it("applies variant modifier class", () => {
        const theme = createTheme({
            text: { variants: { heading: { fontSize: "32px" } } },
        });

        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText variant="heading">Title</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("htmlText--heading");
    });

    it("applies bottomSpacing modifier class", () => {
        const theme = createTheme();
        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText bottomSpacing>Text</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("htmlText--bottomSpacing");
    });

    it("merges consumer className", () => {
        const theme = createTheme();
        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText className="custom">Text</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("htmlText");
        expect(html).toContain("custom");
    });

    it("lets user style prop override theme styles", () => {
        const theme = createTheme({ text: { fontFamily: "Arial, sans-serif" } });
        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText style={{ fontFamily: "Georgia" }}>Hello</HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain("font-family:Georgia");
    });

    it("forwards standard td attributes", () => {
        const theme = createTheme();
        const html = renderHtmlText(
            <ThemeProvider theme={theme}>
                <HtmlText colSpan={2} align="center">
                    Hello
                </HtmlText>
            </ThemeProvider>,
        );

        expect(html).toContain('colSpan="2"');
        expect(html).toContain('align="center"');
    });

    it("throws without ThemeProvider", () => {
        expect(() => renderHtmlText(<HtmlText>Hello</HtmlText>)).toThrow();
    });
});
