import { AccordionBlock } from "@src/common/blocks/AccordionBlock";
import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { expect, userEvent, within } from "storybook/test";

const createAccordionData = (items: Array<{ title: string; openByDefault?: boolean }>) => ({
    blocks: items.map((item, index) => ({
        key: `item-${index}`,
        props: {
            title: item.title,
            titleHtmlTag: "h3" as const,
            openByDefault: item.openByDefault ?? false,
            content: {
                blocks: [
                    {
                        key: `content-${index}`,
                        type: "richtext",
                        visible: true,
                        props: {
                            draftContent: {
                                blocks: [
                                    {
                                        key: `text-${index}`,
                                        text: `Content for ${item.title}`,
                                        type: "unstyled",
                                        depth: 0,
                                        inlineStyleRanges: [],
                                        entityRanges: [],
                                        data: {},
                                    },
                                ],
                                entityMap: {},
                            },
                        },
                    },
                ],
            },
        },
    })),
});

const meta: Meta<typeof AccordionBlock> = {
    title: "Blocks/AccordionBlock",
    component: AccordionBlock,
};

export default meta;
type Story = StoryObj<typeof AccordionBlock>;

export const Default: Story = {
    args: {
        data: createAccordionData([{ title: "First Item" }, { title: "Second Item" }, { title: "Third Item" }]),
    },
};

export const WithOpenByDefault: Story = {
    args: {
        data: createAccordionData([{ title: "Open Item", openByDefault: true }, { title: "Closed Item" }, { title: "Another Closed Item" }]),
    },
};

export const SingleItem: Story = {
    args: {
        data: createAccordionData([{ title: "Only Item" }]),
    },
};

export const ExpandCollapse: Story = {
    args: {
        data: createAccordionData([{ title: "Expandable Item" }, { title: "Another Item" }]),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Click the first accordion button to expand
        const firstButton = canvas.getAllByRole("button")[0];
        await userEvent.click(firstButton);
        await expect(firstButton).toHaveAttribute("aria-expanded", "true");

        // Click again to collapse
        await userEvent.click(firstButton);
        await expect(firstButton).toHaveAttribute("aria-expanded", "false");
    },
};

export const ExpandMultiple: Story = {
    args: {
        data: createAccordionData([{ title: "First Item" }, { title: "Second Item" }, { title: "Third Item" }]),
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const buttons = canvas.getAllByRole("button");

        // Expand first item
        await userEvent.click(buttons[0]);
        await expect(buttons[0]).toHaveAttribute("aria-expanded", "true");

        // Expand second item
        await userEvent.click(buttons[1]);
        await expect(buttons[1]).toHaveAttribute("aria-expanded", "true");

        // First should still be expanded
        await expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    },
};
