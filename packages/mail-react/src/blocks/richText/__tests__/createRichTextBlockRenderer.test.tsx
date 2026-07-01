import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createTheme } from "../../../theme/createTheme.js";
import { ThemeProvider } from "../../../theme/ThemeProvider.js";
import type { RichTextBlockData } from "../common.js";
import { createRichTextBlockRenderer } from "../createRichTextBlockRenderer.js";
import { HtmlBlockText } from "../HtmlBlockText.js";
import { MjmlBlockText } from "../MjmlBlockText.js";

function renderWithTheme(node: ReactNode, theme = createTheme()): string {
    return renderToStaticMarkup(<ThemeProvider theme={theme}>{node}</ThemeProvider>);
}

function createDraftBlock(overrides: { key: string; text: string; type?: string; [key: string]: unknown }) {
    return { type: "unstyled", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {}, ...overrides };
}

function createBlockData(blocks: Array<Record<string, unknown>>, entityMap: Record<string, unknown> = {}): RichTextBlockData {
    return { draftContent: { blocks, entityMap } };
}

const themeWithVariants = createTheme({
    text: {
        variants: {
            heading1: { fontSize: "32px", fontWeight: 700 },
            body: { fontSize: "16px" },
        },
    },
});

describe("createRichTextBlockRenderer — base rendering", () => {
    const MjmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: MjmlBlockText });
    const HtmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: HtmlBlockText });

    it("renders each draft block as its own MjmlText with base theme styles", () => {
        const data = createBlockData([createDraftBlock({ key: "a", text: "First" }), createDraftBlock({ key: "b", text: "Second" })]);
        const markup = renderWithTheme(<MjmlRichTextBlock data={data} />);

        expect(markup.match(/<mj-text/g)).toHaveLength(2);
        expect(markup).toContain("First");
        expect(markup).toContain("Second");
    });

    it("renders each draft block as its own HtmlText div with a richTextBlock__text class", () => {
        const data = createBlockData([createDraftBlock({ key: "a", text: "First" }), createDraftBlock({ key: "b", text: "Second" })]);
        const markup = renderWithTheme(<HtmlRichTextBlock data={data} />);

        expect(markup.match(/<div/g)).toHaveLength(2);
        expect(markup.match(/richTextBlock__text/g)).toHaveLength(2);
    });

    it("renders unmapped block types with base styles instead of failing", () => {
        const data = createBlockData([createDraftBlock({ key: "a", text: "Custom", type: "paragraph-standard" })]);
        const markup = renderWithTheme(<MjmlRichTextBlock data={data} />);

        expect(markup).toContain("Custom");
        expect(markup).not.toContain("mjmlText--");
    });

    it("renders nothing when draftContent has no blocks with text", () => {
        const data = createBlockData([createDraftBlock({ key: "a", text: "" })]);

        expect(renderWithTheme(<MjmlRichTextBlock data={data} />)).toBe("");
    });

    it("renders nothing when draftContent is not draft-js raw content", () => {
        const data: RichTextBlockData = { draftContent: "not draft content" };

        expect(renderWithTheme(<MjmlRichTextBlock data={data} />)).toBe("");
    });

    it("filters empty draft blocks", () => {
        const data = createBlockData([
            createDraftBlock({ key: "a", text: "Content" }),
            createDraftBlock({ key: "b", text: "" }),
            createDraftBlock({ key: "c", text: "More" }),
        ]);
        const markup = renderWithTheme(<MjmlRichTextBlock data={data} />);

        expect(markup.match(/<mj-text/g)).toHaveLength(2);
    });
});

describe("createRichTextBlockRenderer — block type configuration", () => {
    const blockTypes = {
        "header-one": { variant: "heading1" },
        "paragraph-standard": { variant: "body", className: "customParagraph" },
        unstyled: { color: "#ff0000", fontWeight: 700 },
    };
    const MjmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: MjmlBlockText, blockTypes });
    const HtmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: HtmlBlockText, blockTypes });

    it("applies the mapped variant to the text component", () => {
        const data = createBlockData([createDraftBlock({ key: "a", text: "Heading", type: "header-one" })]);

        expect(renderWithTheme(<MjmlRichTextBlock data={data} />, themeWithVariants)).toContain("mjmlText--heading1");
        expect(renderWithTheme(<HtmlRichTextBlock data={data} />, themeWithVariants)).toContain("htmlText--heading1");
    });

    it("keeps the variant's resolved styles when the block type config sets no style props", () => {
        const data = createBlockData([createDraftBlock({ key: "a", text: "Heading", type: "header-one" })]);
        const markup = renderWithTheme(<MjmlRichTextBlock data={data} />, themeWithVariants);

        expect(markup).toContain('font-weight="700"');
        expect(markup).toContain('font-size="32px"');
    });

    it("passes className through to the text component", () => {
        const data = createBlockData([createDraftBlock({ key: "a", text: "Paragraph", type: "paragraph-standard" })]);

        expect(renderWithTheme(<MjmlRichTextBlock data={data} />, themeWithVariants)).toContain("customParagraph");
    });

    it("applies plain style props in the Mjml variant as MjmlText attributes", () => {
        const data = createBlockData([createDraftBlock({ key: "a", text: "Styled" })]);
        const markup = renderWithTheme(<MjmlRichTextBlock data={data} />);

        expect(markup).toContain('color="#ff0000"');
        expect(markup).toContain('font-weight="700"');
    });

    it("applies plain style props in the Html variant as inline styles", () => {
        const data = createBlockData([createDraftBlock({ key: "a", text: "Styled" })]);
        const markup = renderWithTheme(<HtmlRichTextBlock data={data} />);

        expect(markup).toContain("color:#ff0000");
        expect(markup).toContain("font-weight:700");
    });
});

describe("createRichTextBlockRenderer — bottom spacing", () => {
    const HtmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: HtmlBlockText });

    it("applies bottomSpacing to every block except the last one with text", () => {
        const data = createBlockData([
            createDraftBlock({ key: "a", text: "First" }),
            createDraftBlock({ key: "b", text: "Last" }),
            createDraftBlock({ key: "c", text: "" }),
        ]);
        const markup = renderWithTheme(<HtmlRichTextBlock data={data} />);
        const blocks = markup.split("</div>").filter((block) => block !== "");

        expect(blocks[0]).toContain("htmlText--bottomSpacing");
        expect(blocks[1]).not.toContain("htmlText--bottomSpacing");
    });
});

describe("createRichTextBlockRenderer — inline styles and line breaks", () => {
    const HtmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: HtmlBlockText });

    it("renders BOLD and ITALIC ranges as semantic tags with an explicit style fallback", () => {
        const data = createBlockData([
            createDraftBlock({
                key: "a",
                text: "bold italic",
                inlineStyleRanges: [
                    { offset: 0, length: 4, style: "BOLD" },
                    { offset: 5, length: 6, style: "ITALIC" },
                ],
            }),
        ]);
        const markup = renderWithTheme(<HtmlRichTextBlock data={data} />);

        expect(markup).toContain('<strong style="font-weight:bold">bold</strong>');
        expect(markup).toContain('<em style="font-style:italic">italic</em>');
    });

    it("renders a STRIKETHROUGH range", () => {
        const data = createBlockData([
            createDraftBlock({ key: "a", text: "struck", inlineStyleRanges: [{ offset: 0, length: 6, style: "STRIKETHROUGH" }] }),
        ]);
        const markup = renderWithTheme(<HtmlRichTextBlock data={data} />);

        expect(markup).toContain("<s>struck</s>");
    });

    it("renders a line break within a block as <br/>", () => {
        const data = createBlockData([createDraftBlock({ key: "a", text: "line one\nline two" })]);
        const markup = renderWithTheme(<HtmlRichTextBlock data={data} />);

        expect(markup).toContain("line one<br/>line two");
    });
});

describe("createRichTextBlockRenderer — links", () => {
    const HtmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: HtmlBlockText });

    function createLinkBlockData(linkBlock: Record<string, unknown>): RichTextBlockData {
        return createBlockData([createDraftBlock({ key: "a", text: "Visit our website now", entityRanges: [{ offset: 6, length: 11, key: 0 }] })], {
            "0": { type: "LINK", mutability: "MUTABLE", data: { block: linkBlock } },
        });
    }

    it("renders an external LINK entity as an inline link with the target URL", () => {
        const data = createLinkBlockData({ type: "external", props: { targetUrl: "https://example.com", openInNewWindow: false } });
        const markup = renderWithTheme(<HtmlRichTextBlock data={data} />);

        expect(markup).toContain('href="https://example.com"');
        expect(markup).toContain("richTextBlock__link");
        expect(markup).toContain("our website");
    });

    it("renders the text of an unconfigured link type without a link", () => {
        const data = createLinkBlockData({ type: "internal", props: { targetPage: { id: "1", path: "/" } } });
        const markup = renderWithTheme(<HtmlRichTextBlock data={data} />);

        expect(markup).not.toContain("<a");
        expect(markup).toContain("our website");
    });

    it("resolves application-defined link types through the linkTypes option", () => {
        const HtmlPhoneLinkRichTextBlock = createRichTextBlockRenderer({
            blockTextComponent: HtmlBlockText,
            linkTypes: {
                phone: (props) => {
                    if (typeof props !== "object" || props === null || !("phoneNumber" in props)) {
                        return undefined;
                    }

                    return typeof props.phoneNumber === "string" ? `tel:${props.phoneNumber}` : undefined;
                },
            },
        });
        const data = createLinkBlockData({ type: "phone", props: { phoneNumber: "+431234567" } });
        const markup = renderWithTheme(<HtmlPhoneLinkRichTextBlock data={data} />);

        expect(markup).toContain('href="tel:+431234567"');
    });

    it("keeps the built-in external link type when linkTypes adds more", () => {
        const HtmlPhoneLinkRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: HtmlBlockText, linkTypes: { phone: () => undefined } });
        const data = createLinkBlockData({ type: "external", props: { targetUrl: "https://example.com", openInNewWindow: false } });
        const markup = renderWithTheme(<HtmlPhoneLinkRichTextBlock data={data} />);

        expect(markup).toContain('href="https://example.com"');
    });
});

describe("createRichTextBlockRenderer — lists", () => {
    const MjmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: MjmlBlockText });
    const HtmlRichTextBlock = createRichTextBlockRenderer({ blockTextComponent: HtmlBlockText });

    it("groups consecutive unordered list items into one list within one text component", () => {
        const data = createBlockData([
            createDraftBlock({ key: "a", text: "Item one", type: "unordered-list-item" }),
            createDraftBlock({ key: "b", text: "Item two", type: "unordered-list-item" }),
        ]);
        const markup = renderWithTheme(<MjmlRichTextBlock data={data} />);

        expect(markup.match(/<mj-text/g)).toHaveLength(1);
        expect(markup.match(/<ul/g)).toHaveLength(1);
        expect(markup.match(/<li/g)).toHaveLength(2);
    });

    it("renders ordered list items as an ol with element class names", () => {
        const data = createBlockData([
            createDraftBlock({ key: "a", text: "Item one", type: "ordered-list-item" }),
            createDraftBlock({ key: "b", text: "Item two", type: "ordered-list-item" }),
        ]);
        const markup = renderWithTheme(<HtmlRichTextBlock data={data} />);

        expect(markup.match(/<ol class="richTextBlock__list"/g)).toHaveLength(1);
        expect(markup.match(/<li class="richTextBlock__listItem"/g)).toHaveLength(2);
    });
});
