import { MjmlColumn } from "@faire/mjml-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { MjmlSection } from "../../../components/section/MjmlSection.js";
import { createTheme } from "../../../theme/createTheme.js";
import { createRichTextBlock } from "../createRichTextBlock.js";
import { exampleBlockData, headlinesOnlyBlockData } from "./exampleBlockData.js";

const { MjmlRichTextBlock } = createRichTextBlock();

type Story = StoryObj<typeof MjmlRichTextBlock>;

const config: Meta<typeof MjmlRichTextBlock> = {
    title: "Components/Blocks/MjmlRichTextBlock",
    component: MjmlRichTextBlock,
    tags: ["autodocs"],
    parameters: {
        docs: {
            description: {
                // Duplicates the TSDoc on MjmlRichTextBlock in createRichTextBlock.tsx — Storybook cannot read it from factory return type properties. Update both when the description changes.
                component:
                    "Renders CMS RichText block data (draft-js raw content) as one `MjmlText` per draft block. Must be placed within an `MjmlColumn`.",
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
                <MjmlRichTextBlock data={exampleBlockData} />
            </MjmlColumn>
        </MjmlSection>
    ),
};

const { MjmlRichTextBlock: MjmlVariantsRichTextBlock } = createRichTextBlock({
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
                <MjmlVariantsRichTextBlock data={exampleBlockData} />
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

const { MjmlRichTextBlock: MjmlCustomLinkTypeRichTextBlock } = createRichTextBlock({
    linkTypes: {
        internal: resolveInternalLinkHref,
    },
});

/** Configuring a custom link type via the `linkTypes` option. The built-in `external` resolver is included by default; add entries for any other link types your CMS uses (e.g. `internal`) to render them as anchors. Email links must be absolute URLs, so the resolver prepends the site's base URL. */
export const WithCustomLinkType: Story = {
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlCustomLinkTypeRichTextBlock data={exampleBlockData} />
            </MjmlColumn>
        </MjmlSection>
    ),
};

const { MjmlRichTextBlock: MjmlHeadlineRichTextBlock } = createRichTextBlock({
    blockTypes: {
        "header-one": { variant: "heading1" },
        "header-two": { variant: "heading2" },
    },
});

/** A second factory call configured for headline-only content, renamed at the consumer (`MjmlHeadlineRichTextBlock`). */
export const RestrictedHeadlineBlock: Story = {
    parameters: {
        theme: themeWithVariants,
    },
    render: () => (
        <MjmlSection indent>
            <MjmlColumn>
                <MjmlHeadlineRichTextBlock data={headlinesOnlyBlockData} />
            </MjmlColumn>
        </MjmlSection>
    ),
};
