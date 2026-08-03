import { MjmlColumn } from "@faire/mjml-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MjmlSection } from "../../../components/section/MjmlSection.js";
import { createTheme } from "../../../theme/createTheme.js";
import { createTipTapRichTextBlock } from "../createTipTapRichTextBlock.js";
import { exampleBlockData, headlinesOnlyBlockData, highlightBlockData, placeholderBlockData } from "./exampleBlockData.js";

const { MjmlTipTapRichTextBlock } = createTipTapRichTextBlock();

type Story = StoryObj<typeof MjmlTipTapRichTextBlock>;

const config: Meta<typeof MjmlTipTapRichTextBlock> = {
    title: "Components/Blocks/MjmlTipTapRichTextBlock",
    component: MjmlTipTapRichTextBlock,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                // Duplicates the TSDoc on MjmlTipTapRichTextBlock in createTipTapRichTextBlock.tsx — Storybook cannot read it from factory return type properties. Update both when the description changes.
                component:
                    "Renders CMS TipTapRichText block data (Tip-Tap/ProseMirror JSON) as one `MjmlText` per top-level node. Must be placed within an `MjmlColumn`.",
            },
        },
    },
};

export default config;

/** A block from `createTipTapRichTextBlock()` without options: every top-level node renders with the base theme text styles. */
export const Default: Story = {
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlTipTapRichTextBlock data={exampleBlockData} />
            </MjmlColumn>
        </MjmlSection>
    ),
};

const { MjmlTipTapRichTextBlock: MjmlVariantsTipTapRichTextBlock } = createTipTapRichTextBlock({
    blockTypes: {
        "heading-1": { variant: "heading1" },
        "heading-2": { variant: "heading2" },
        paragraph: { variant: "body" },
        "unordered-list": { variant: "body" },
        "ordered-list": { variant: "body" },
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

/** Tip-Tap text block types mapped to theme text variants via the factory's `blockTypes` option. */
export const WithVariants: Story = {
    parameters: {
        theme: themeWithVariants,
    },
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlVariantsTipTapRichTextBlock data={exampleBlockData} />
            </MjmlColumn>
        </MjmlSection>
    ),
};

function resolveInternalLinkHref(props: { targetPage: { path: string } }): string {
    return `https://example.com${props.targetPage.path}`;
}

const { MjmlTipTapRichTextBlock: MjmlCustomLinkTypeTipTapRichTextBlock } = createTipTapRichTextBlock({
    linkTypes: {
        internal: resolveInternalLinkHref,
    },
});

/** Configuring a custom link type via the `linkTypes` option. The built-in `external` resolver is included by default; add entries for any other link types your CMS uses (e.g. `internal`) to render them as anchors. Email links must be absolute URLs, so the resolver prepends the site's base URL. */
export const WithCustomLinkType: Story = {
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlCustomLinkTypeTipTapRichTextBlock data={exampleBlockData} />
            </MjmlColumn>
        </MjmlSection>
    ),
};

const { MjmlTipTapRichTextBlock: MjmlCustomInlineStyleTipTapRichTextBlock } = createTipTapRichTextBlock({
    inlineStyles: {
        highlight: (children, { key }) => (
            <span key={key} style={{ backgroundColor: "#ff0000", color: "#ffffff" }}>
                {children}
            </span>
        ),
    },
});

/** Rendering a custom inline style via the `inlineStyles` option. `highlight` is the `inlineStyle` mark's `attrs.type` value the CMS block stores when the application configures it via `inlineStyles` — this option has no built-ins, so the email decides how it looks. */
export const WithCustomInlineStyle: Story = {
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlCustomInlineStyleTipTapRichTextBlock data={highlightBlockData} />
            </MjmlColumn>
        </MjmlSection>
    ),
};

/** A `placeholder` node renders as literal `{{name}}` text — the ESP substitutes it per recipient downstream. */
export const WithPlaceholder: Story = {
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlTipTapRichTextBlock data={placeholderBlockData} />
            </MjmlColumn>
        </MjmlSection>
    ),
};

const { MjmlTipTapRichTextBlock: MjmlHeadlineTipTapRichTextBlock } = createTipTapRichTextBlock({
    blockTypes: {
        "heading-1": { variant: "heading1" },
        "heading-2": { variant: "heading2" },
    },
});

/** A second factory call configured for headline-only content, renamed at the consumer (`MjmlHeadlineTipTapRichTextBlock`). */
export const RestrictedHeadlineBlock: Story = {
    parameters: {
        theme: themeWithVariants,
    },
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlHeadlineTipTapRichTextBlock data={headlinesOnlyBlockData} />
            </MjmlColumn>
        </MjmlSection>
    ),
};
