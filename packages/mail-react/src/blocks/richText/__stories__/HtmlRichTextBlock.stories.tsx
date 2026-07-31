import { MjmlColumn, MjmlRaw } from "@faire/mjml-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MjmlSection } from "../../../components/section/MjmlSection.js";
import { registerStyles } from "../../../styles/registerStyles.js";
import { createTheme } from "../../../theme/createTheme.js";
import { css } from "../../../utils/css.js";
import { createRichTextBlock } from "../createRichTextBlock.js";
import { exampleBlockData, headlinesOnlyBlockData, highlightBlockData, listSpacingBlockData, listVarietyBlockData } from "./exampleBlockData.js";

const { HtmlRichTextBlock } = createRichTextBlock();

type Story = StoryObj<typeof HtmlRichTextBlock>;

const config: Meta<typeof HtmlRichTextBlock> = {
    title: "Components/Blocks/HtmlRichTextBlock",
    component: HtmlRichTextBlock,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                // Duplicates the TSDoc on HtmlRichTextBlock in createRichTextBlock.tsx — Storybook cannot read it from factory return type properties. Update both when the description changes.
                component:
                    "Renders CMS RichText block data (draft-js raw content) as one `HtmlText` div per draft block, for raw-HTML contexts such as `MjmlRaw`.",
            },
        },
    },
};

export default config;

/** A block from `createRichTextBlock()` without options: every draft block renders with the base theme text styles. */
export const Default: Story = {
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlRaw>
                    <HtmlRichTextBlock data={exampleBlockData} />
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

const listVarietyTheme = createTheme({
    text: {
        defaultVariant: "body",
        variants: {
            body: { fontSize: { default: "16px", mobile: "14px" }, lineHeight: { default: "24px", mobile: "20px" }, bottomSpacing: "16px" },
        },
    },
});

/** Lists render as a table, not as `<ul>` / `<ol>`, so their spacing is consistent across email clients. */
export const ListVariety: Story = {
    parameters: {
        theme: listVarietyTheme,
    },
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlRaw>
                    <HtmlRichTextBlock data={listVarietyBlockData} />
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

const listSpacingTheme = createTheme({
    text: {
        defaultVariant: "body",
        variants: { body: { fontSize: "16px", lineHeight: "24px", bottomSpacing: "16px" } },
    },
    list: {
        indent: { default: 40, mobile: 8 },
        markerGap: { default: 24, mobile: 4 },
        itemSpacing: { default: 20, mobile: 4 },
    },
});

/** List spacing comes from `theme.list`, and every token accepts a value per breakpoint. Resize the preview below 420px to see the mobile values. */
export const ListSpacing: Story = {
    parameters: {
        theme: listSpacingTheme,
    },
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlRaw>
                    <HtmlRichTextBlock data={listSpacingBlockData} />
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

const { HtmlRichTextBlock: HtmlPerVariantRichTextBlock } = createRichTextBlock({
    blockTypes: {
        "unordered-list-item": { variant: "copyDefault" },
        "ordered-list-item": { variant: "copyLarge" },
    },
});

const perVariantListSpacingTheme = createTheme({
    text: {
        variants: {
            copyDefault: { fontSize: "16px", lineHeight: "24px", bottomSpacing: "24px" },
            copyLarge: { fontSize: "20px", lineHeight: "28px", bottomSpacing: "24px" },
        },
    },
    list: { itemSpacing: 8 },
});

registerStyles(
    css`
        .perVariantListSpacingSection .richTextBlock__list--variantCopyLarge .richTextBlock__listItem--itemSpacing > td {
            padding-bottom: 24px !important;
        }
    `,
    { inline: true },
);

/** The theme's `list.itemSpacing` applies to every list the block renders. A single list departs from it through a rule scoped to its text variant, since the variant is what a list carries. */
export const ListSpacingPerVariant: Story = {
    parameters: {
        theme: perVariantListSpacingTheme,
    },
    render: () => (
        <MjmlSection indent className="perVariantListSpacingSection">
            <MjmlColumn>
                <MjmlRaw>
                    <HtmlPerVariantRichTextBlock data={listSpacingBlockData} />
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

function resolveInternalLinkHref(props: { targetPage: { path: string } }): string {
    return `https://example.com${props.targetPage.path}`;
}

const { HtmlRichTextBlock: HtmlCustomLinkTypeRichTextBlock } = createRichTextBlock({
    linkTypes: {
        internal: resolveInternalLinkHref,
    },
});

/** Configuring a custom link type via the `linkTypes` option. The built-in `external` resolver is included by default; add entries for any other link types your CMS uses (e.g. `internal`) to render them as anchors. Email links must be absolute URLs, so the resolver prepends the site's base URL. */
export const WithCustomLinkType: Story = {
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlRaw>
                    <HtmlCustomLinkTypeRichTextBlock data={exampleBlockData} />
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

const { HtmlRichTextBlock: HtmlVariantsRichTextBlock } = createRichTextBlock({
    blockTypes: {
        "header-one": { variant: "heading1" },
        "header-two": { variant: "heading2" },
        "paragraph-standard": { variant: "body" },
        "unordered-list-item": { variant: "body" },
        "ordered-list-item": { variant: "body" },
    },
});

const themeWithVariants = createTheme({
    text: {
        variants: {
            heading1: { fontSize: "32px", fontWeight: 700, lineHeight: "40px", bottomSpacing: "24px" },
            heading2: { fontSize: "24px", fontWeight: 700, lineHeight: "32px", bottomSpacing: "20px" },
            body: { fontSize: "16px", lineHeight: "24px" },
        },
    },
});

/** Draft block types mapped to theme text variants via the factory's `blockTypes` option. */
export const WithVariants: Story = {
    parameters: {
        theme: themeWithVariants,
    },
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlRaw>
                    <HtmlVariantsRichTextBlock data={exampleBlockData} />
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

const { HtmlRichTextBlock: HtmlCustomInlineStyleRichTextBlock } = createRichTextBlock({
    inline: {
        HIGHLIGHT: (children, { key }) => (
            <span key={key} style={{ backgroundColor: "#ff0000", color: "#ffffff" }}>
                {children}
            </span>
        ),
    },
});

/** Rendering a custom inline style via the `inline` option. `HIGHLIGHT` is not a built-in style — the application defines it in its RTE (`customInlineStyles`), and the email decides how it looks. The `inline` option merges over the built-in styles, so any the caller does not override keep their defaults. */
export const WithCustomInlineStyle: Story = {
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlRaw>
                    <HtmlCustomInlineStyleRichTextBlock data={highlightBlockData} />
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};

const { HtmlRichTextBlock: HtmlHeadlineRichTextBlock } = createRichTextBlock({
    blockTypes: {
        "header-one": { variant: "heading1" },
        "header-two": { variant: "heading2" },
    },
});

/** A second factory call configured for headline-only content, renamed at the consumer (`HtmlHeadlineRichTextBlock`). */
export const RestrictedHeadlineBlock: Story = {
    parameters: {
        theme: themeWithVariants,
    },
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlRaw>
                    <HtmlHeadlineRichTextBlock data={headlinesOnlyBlockData} />
                </MjmlRaw>
            </MjmlColumn>
        </MjmlSection>
    ),
};
