import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { createTheme } from "../../../theme/createTheme.js";
import { ThemeProvider } from "../../../theme/ThemeProvider.js";
import type { TipTapRichTextBlockData } from "../common.js";
import { createTipTapRichTextBlock } from "../createTipTapRichTextBlock.js";

function renderWithTheme(node: ReactNode, theme = createTheme()): string {
    return renderToStaticMarkup(<ThemeProvider theme={theme}>{node}</ThemeProvider>);
}

function text(value: string, marks?: Array<{ type: string; attrs?: Record<string, unknown> }>) {
    return { type: "text", text: value, ...(marks && { marks }) };
}

function paragraph(content: unknown[], attrs?: Record<string, unknown>) {
    return { type: "paragraph", ...(attrs && { attrs }), content };
}

function heading(level: number, content: unknown[], attrs?: Record<string, unknown>) {
    return { type: "heading", attrs: { level, ...attrs }, content };
}

function doc(content: unknown[]): TipTapRichTextBlockData {
    return { tipTapContent: { type: "doc", content } };
}

const themeWithVariants = createTheme({
    text: {
        variants: {
            heading1: { fontSize: "32px", fontWeight: 700 },
            body: { fontSize: "16px" },
        },
    },
});

describe("createTipTapRichTextBlock — base rendering", () => {
    const { MjmlTipTapRichTextBlock, HtmlTipTapRichTextBlock } = createTipTapRichTextBlock();

    it("renders each top-level node as its own MjmlText with base theme styles", () => {
        const data = doc([paragraph([text("First")]), paragraph([text("Second")])]);
        const markup = renderWithTheme(<MjmlTipTapRichTextBlock data={data} />);

        expect(markup.match(/<mj-text/g)).toHaveLength(2);
        expect(markup).toContain("First");
        expect(markup).toContain("Second");
    });

    it("renders each top-level node as its own HtmlText div with a tipTapRichTextBlock__text class", () => {
        const data = doc([paragraph([text("First")]), paragraph([text("Second")])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup.match(/<div/g)).toHaveLength(2);
        expect(markup.match(/tipTapRichTextBlock__text/g)).toHaveLength(2);
    });

    it("renders nothing when tipTapContent has no non-empty top-level nodes", () => {
        const data = doc([paragraph([])]);

        expect(renderWithTheme(<MjmlTipTapRichTextBlock data={data} />)).toBe("");
    });

    it("renders nothing when tipTapContent is not a Tip-Tap doc", () => {
        const data: TipTapRichTextBlockData = { tipTapContent: "not tiptap content" };

        expect(renderWithTheme(<MjmlTipTapRichTextBlock data={data} />)).toBe("");
    });

    it("filters empty top-level paragraphs", () => {
        const data = doc([paragraph([text("Content")]), paragraph([]), paragraph([text("More")])]);
        const markup = renderWithTheme(<MjmlTipTapRichTextBlock data={data} />);

        expect(markup.match(/<mj-text/g)).toHaveLength(2);
    });
});

describe("createTipTapRichTextBlock — block type configuration", () => {
    const { MjmlTipTapRichTextBlock, HtmlTipTapRichTextBlock } = createTipTapRichTextBlock({
        blockTypes: {
            "heading-1": { variant: "heading1" },
            paragraph: { variant: "body", className: "customParagraph" },
        },
    });

    it("applies the mapped variant to the text component for a heading level", () => {
        const data = doc([heading(1, [text("Heading")])]);

        expect(renderWithTheme(<MjmlTipTapRichTextBlock data={data} />, themeWithVariants)).toContain("mjmlText--heading1");
        expect(renderWithTheme(<HtmlTipTapRichTextBlock data={data} />, themeWithVariants)).toContain("htmlText--heading1");
    });

    it("passes className through to the text component", () => {
        const data = doc([paragraph([text("Paragraph")])]);

        expect(renderWithTheme(<MjmlTipTapRichTextBlock data={data} />, themeWithVariants)).toContain("customParagraph");
    });

    it("applies plain style props in the Mjml variant as MjmlText attributes", () => {
        const { MjmlTipTapRichTextBlock: MjmlStyledBlock } = createTipTapRichTextBlock({
            blockTypes: { paragraph: { color: "#ff0000", fontWeight: 700 } },
        });
        const data = doc([paragraph([text("Styled")])]);
        const markup = renderWithTheme(<MjmlStyledBlock data={data} />);

        expect(markup).toContain('color="#ff0000"');
        expect(markup).toContain('font-weight="700"');
    });

    it("applies plain style props in the Html variant as inline styles", () => {
        const { HtmlTipTapRichTextBlock: HtmlStyledBlock } = createTipTapRichTextBlock({
            blockTypes: { paragraph: { color: "#ff0000", fontWeight: 700 } },
        });
        const data = doc([paragraph([text("Styled")])]);
        const markup = renderWithTheme(<HtmlStyledBlock data={data} />);

        expect(markup).toContain("color:#ff0000");
        expect(markup).toContain("font-weight:700");
    });

    it("renders unmapped block types with base styles instead of failing", () => {
        const data = doc([heading(2, [text("Custom")])]);
        const markup = renderWithTheme(<MjmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("Custom");
        expect(markup).not.toContain("mjmlText--");
    });
});

describe("createTipTapRichTextBlock — textBlockStyles configuration", () => {
    const { MjmlTipTapRichTextBlock } = createTipTapRichTextBlock({
        blockTypes: { paragraph: { variant: "body" } },
        textBlockStyles: { small: { variant: "heading1" } },
    });

    it("prefers a mapped textBlockStyle over the structural blockTypes entry", () => {
        const data = doc([paragraph([text("Small paragraph")], { textBlockStyle: "small" })]);

        expect(renderWithTheme(<MjmlTipTapRichTextBlock data={data} />, themeWithVariants)).toContain("mjmlText--heading1");
    });

    it("falls back to the structural blockTypes entry when the textBlockStyle is unmapped", () => {
        const data = doc([paragraph([text("Regular paragraph")], { textBlockStyle: "unknownStyle" })]);

        expect(renderWithTheme(<MjmlTipTapRichTextBlock data={data} />, themeWithVariants)).toContain("mjmlText--body");
    });
});

describe("createTipTapRichTextBlock — bottom spacing", () => {
    const { HtmlTipTapRichTextBlock } = createTipTapRichTextBlock();

    it("applies bottomSpacing to every top-level node except the last one", () => {
        const data = doc([paragraph([text("First")]), paragraph([text("Last")]), paragraph([])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);
        const blocks = markup.split("</div>").filter((block) => block !== "");

        expect(blocks[0]).toContain("htmlText--bottomSpacing");
        expect(blocks[1]).not.toContain("htmlText--bottomSpacing");
    });
});

describe("createTipTapRichTextBlock — marks", () => {
    const { HtmlTipTapRichTextBlock } = createTipTapRichTextBlock();

    it("renders bold and italic marks as semantic tags with an explicit style fallback", () => {
        const data = doc([paragraph([text("bold", [{ type: "bold" }]), text(" "), text("italic", [{ type: "italic" }])])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain('<strong style="font-weight:bold">bold</strong>');
        expect(markup).toContain('<em style="font-style:italic">italic</em>');
    });

    it("renders strike, superscript and subscript marks", () => {
        const data = doc([
            paragraph([text("struck", [{ type: "strike" }]), text("up", [{ type: "superscript" }]), text("down", [{ type: "subscript" }])]),
        ]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("<s>struck</s>");
        expect(markup).toContain("<sup>up</sup>");
        expect(markup).toContain("<sub>down</sub>");
    });

    it("stacks multiple marks on the same text node", () => {
        const data = doc([paragraph([text("both", [{ type: "bold" }, { type: "italic" }])])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain('<em style="font-style:italic"><strong style="font-weight:bold">both</strong></em>');
    });

    it("merges the marks option over the built-ins: overrides one, keeps the rest", () => {
        const { HtmlTipTapRichTextBlock: HtmlCustomBoldBlock } = createTipTapRichTextBlock({
            marks: {
                bold: (children, { key }) => (
                    <span key={key} className="customBold">
                        {children}
                    </span>
                ),
            },
        });
        const data = doc([paragraph([text("bold", [{ type: "bold" }]), text("italic", [{ type: "italic" }])])]);
        const markup = renderWithTheme(<HtmlCustomBoldBlock data={data} />);

        expect(markup).toContain('<span class="customBold">bold</span>');
        expect(markup).toContain('<em style="font-style:italic">italic</em>');
    });

    it("renders an unknown mark's text unchanged", () => {
        const data = doc([paragraph([text("plain", [{ type: "unknownMark" }])])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("plain");
        expect(markup).not.toContain("<unknownMark");
    });
});

describe("createTipTapRichTextBlock — inline styles", () => {
    it("renders a custom inline style configured via the inlineStyles option", () => {
        const { HtmlTipTapRichTextBlock } = createTipTapRichTextBlock({
            inlineStyles: {
                highlight: (children, { key }) => (
                    <span key={key} style={{ backgroundColor: "#ff0000" }}>
                        {children}
                    </span>
                ),
            },
        });
        const data = doc([paragraph([text("highlighted", [{ type: "inlineStyle", attrs: { type: "highlight" } }])])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain('<span style="background-color:#ff0000">highlighted</span>');
    });

    it("renders an unconfigured inline style's text unchanged, with no built-in fallback", () => {
        const { HtmlTipTapRichTextBlock } = createTipTapRichTextBlock();
        const data = doc([paragraph([text("plain", [{ type: "inlineStyle", attrs: { type: "highlight" } }])])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("plain");
        expect(markup).not.toContain("<span");
    });
});

describe("createTipTapRichTextBlock — literal nodes", () => {
    const { HtmlTipTapRichTextBlock } = createTipTapRichTextBlock();

    it("renders a hardBreak as <br/>", () => {
        const data = doc([paragraph([text("line one"), { type: "hardBreak" }, text("line two")])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("line one<br/>line two");
    });

    it("renders a nonBreakingSpace as a literal non-breaking space", () => {
        const data = doc([paragraph([text("a"), { type: "nonBreakingSpace" }, text("b")])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("a b");
    });

    it("renders a softHyphen as a literal soft hyphen", () => {
        const data = doc([paragraph([text("extra"), { type: "softHyphen" }, text("ordinary")])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("extra­ordinary");
    });

    it("renders a placeholder as literal {{name}} text", () => {
        const data = doc([paragraph([text("Hi "), { type: "placeholder", attrs: { name: "firstName" } }])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("Hi {{firstName}}");
    });

    it("skips a cmsBlock node silently", () => {
        const data = doc([paragraph([text("Before "), { type: "cmsBlock", attrs: { blockType: "teaser", data: {} } }, text(" after")])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("Before  after");
    });

    it("skips a cmsInlineBlock node silently", () => {
        const data = doc([paragraph([text("Before "), { type: "cmsInlineBlock", attrs: { blockType: "badge", data: {} } }, text(" after")])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("Before  after");
    });
});

describe("createTipTapRichTextBlock — links", () => {
    const { HtmlTipTapRichTextBlock } = createTipTapRichTextBlock();

    function linkMark(linkBlock: Record<string, unknown>) {
        return { type: "link", attrs: { data: { block: linkBlock } } };
    }

    it("renders a link mark with an external link block as an inline link", () => {
        const data = doc([paragraph([text("Visit our website", [linkMark({ type: "external", props: { targetUrl: "https://example.com" } })])])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain('href="https://example.com"');
        expect(markup).toContain("tipTapRichTextBlock__link");
        expect(markup).toContain("Visit our website");
    });

    it("renders the text of an unconfigured link type without a link", () => {
        const data = doc([paragraph([text("our website", [linkMark({ type: "internal", props: { targetPage: { id: "1" } } })])])]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).not.toContain("<a");
        expect(markup).toContain("our website");
    });

    it("resolves application-defined link types through the linkTypes option", () => {
        const { HtmlTipTapRichTextBlock: HtmlPhoneLinkBlock } = createTipTapRichTextBlock({
            linkTypes: {
                phone: (props: { phoneNumber: string }) => `tel:${props.phoneNumber}`,
            },
        });
        const data = doc([paragraph([text("call us", [linkMark({ type: "phone", props: { phoneNumber: "+431234567" } })])])]);
        const markup = renderWithTheme(<HtmlPhoneLinkBlock data={data} />);

        expect(markup).toContain('href="tel:+431234567"');
    });

    it("keeps the built-in external link type when linkTypes adds more", () => {
        const { HtmlTipTapRichTextBlock: HtmlPhoneLinkBlock } = createTipTapRichTextBlock({ linkTypes: { phone: () => undefined } });
        const data = doc([paragraph([text("our website", [linkMark({ type: "external", props: { targetUrl: "https://example.com" } })])])]);
        const markup = renderWithTheme(<HtmlPhoneLinkBlock data={data} />);

        expect(markup).toContain('href="https://example.com"');
    });

    it("types resolver props from the factory's type argument", () => {
        createTipTapRichTextBlock<{ phone: { phoneNumber: string } }>({
            linkTypes: {
                phone: (props) => {
                    // Accessing `phoneNumber` compiles only because `props` is typed from the type argument, not `unknown`.
                    const phoneNumber: string = props.phoneNumber;
                    // @ts-expect-error `props.phoneNumber` is a string, not a number
                    const wrongType: number = props.phoneNumber;

                    return `tel:${phoneNumber}${String(wrongType)}`;
                },
            },
        });
    });

    it("types resolver props from an annotated parameter", () => {
        createTipTapRichTextBlock({
            linkTypes: {
                phone: (props: { phoneNumber: string }) => {
                    // @ts-expect-error `props.phoneNumber` is a string, not a number
                    const phoneNumber: number = props.phoneNumber;

                    return `tel:${String(phoneNumber)}`;
                },
            },
        });
    });
});

describe("createTipTapRichTextBlock — lists", () => {
    const { MjmlTipTapRichTextBlock, HtmlTipTapRichTextBlock } = createTipTapRichTextBlock();

    function listItem(content: unknown[]) {
        return { type: "listItem", content };
    }

    it("groups a top-level bullet list into one text component with element classes", () => {
        const data = doc([
            {
                type: "bulletList",
                content: [listItem([paragraph([text("Item one")])]), listItem([paragraph([text("Item two")])])],
            },
        ]);
        const markup = renderWithTheme(<MjmlTipTapRichTextBlock data={data} />);

        expect(markup.match(/<mj-text/g)).toHaveLength(1);
        expect(markup.match(/<ul/g)).toHaveLength(1);
        expect(markup.match(/<li/g)).toHaveLength(2);
    });

    it("renders an ordered list with element class names", () => {
        const data = doc([
            {
                type: "orderedList",
                content: [listItem([paragraph([text("Item one")])]), listItem([paragraph([text("Item two")])])],
            },
        ]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup.match(/<ol class="tipTapRichTextBlock__list"/g)).toHaveLength(1);
        expect(markup.match(/<li class="tipTapRichTextBlock__listItem"/g)).toHaveLength(2);
    });

    it("flattens a nested list into sibling list items", () => {
        const data = doc([
            {
                type: "bulletList",
                content: [
                    listItem([paragraph([text("Parent item")]), { type: "bulletList", content: [listItem([paragraph([text("Nested item")])])] }]),
                ],
            },
        ]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup.match(/<ul/g)).toHaveLength(1);
        expect(markup.match(/<li/g)).toHaveLength(2);
        expect(markup).toContain("Parent item");
        expect(markup).toContain("Nested item");
    });

    it("joins multiple paragraphs within one list item with <br/>", () => {
        const data = doc([
            {
                type: "bulletList",
                content: [listItem([paragraph([text("First line")]), paragraph([text("Second line")])])],
            },
        ]);
        const markup = renderWithTheme(<HtmlTipTapRichTextBlock data={data} />);

        expect(markup).toContain("First line<br/>Second line");
    });

    it("ignores textBlockStyle on paragraphs inside list items", () => {
        const { HtmlTipTapRichTextBlock: HtmlStyledBlock } = createTipTapRichTextBlock({
            textBlockStyles: { small: { variant: "heading1" } },
        });
        const data = doc([
            {
                type: "bulletList",
                content: [listItem([paragraph([text("Item")], { textBlockStyle: "small" })])],
            },
        ]);
        const markup = renderWithTheme(<HtmlStyledBlock data={data} />, themeWithVariants);

        expect(markup).not.toContain("htmlText--heading1");
    });
});
