import { HeadingBlock } from "@src/common/blocks/HeadingBlock";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

const createRichTextData = (text: string, blockType = "unstyled") => ({
    draftContent: {
        blocks: [{ key: "abc01", text, type: blockType, depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }],
        entityMap: {},
    },
});

const emptyRichTextData = {
    draftContent: {
        blocks: [],
        entityMap: {},
    },
};

const meta: Meta<typeof HeadingBlock> = {
    title: "Blocks/HeadingBlock",
    component: HeadingBlock,
};

export default meta;
type Story = StoryObj<typeof HeadingBlock>;

export const H1Heading: Story = {
    args: {
        data: {
            eyebrow: emptyRichTextData,
            headline: createRichTextData("Main Heading", "header-one"),
            htmlTag: "h1",
        },
    },
};

export const H2Heading: Story = {
    args: {
        data: {
            eyebrow: emptyRichTextData,
            headline: createRichTextData("Section Heading", "header-two"),
            htmlTag: "h2",
        },
    },
};

export const H3Heading: Story = {
    args: {
        data: {
            eyebrow: emptyRichTextData,
            headline: createRichTextData("Subsection Heading", "header-three"),
            htmlTag: "h3",
        },
    },
};

export const WithEyebrow: Story = {
    args: {
        data: {
            eyebrow: createRichTextData("Eyebrow text"),
            headline: createRichTextData("Headline with eyebrow", "header-one"),
            htmlTag: "h1",
        },
    },
};

export const EmptyHeadline: Story = {
    args: {
        data: {
            eyebrow: emptyRichTextData,
            headline: emptyRichTextData,
            htmlTag: "h2",
        },
    },
};
