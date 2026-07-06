import { MjmlColumn, MjmlRaw } from "@faire/mjml-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MjmlSection } from "../../../components/section/MjmlSection.js";
import { createTheme } from "../../../theme/createTheme.js";
import { createRichTextBlock } from "../createRichTextBlock.js";
import { exampleBlockData, headlinesOnlyBlockData, highlightBlockData } from "./exampleBlockData.js";

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

function resolveInternalLinkHref(props: unknown): string | undefined {
    if (typeof props !== "object" || props === null || !("targetPage" in props)) {
        return undefined;
    }

    const { targetPage } = props;

    if (typeof targetPage !== "object" || targetPage === null || !("path" in targetPage)) {
        return undefined;
    }

    const { path } = targetPage;

    return typeof path === "string" ? `https://example.com${path}` : undefined;
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
