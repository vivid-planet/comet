import type { AccordionItemBlockData } from "@src/blocks.generated";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import { AccordionItemBlock } from "./AccordionItemBlock";

const mockData: AccordionItemBlockData = {
    title: "What is Comet DXP?",
    titleHtmlTag: "h3",
    openByDefault: false,
    content: {
        blocks: [],
    },
};

interface AccordionItemStoryArgs {
    isExpanded: boolean;
    onChange: () => void;
}

const meta: Meta<AccordionItemStoryArgs> = {
    title: "Blocks/AccordionItemBlock",
    argTypes: {
        isExpanded: { control: "boolean" },
    },
};

export default meta;
type Story = StoryObj<AccordionItemStoryArgs>;

export const Collapsed: Story = {
    args: {
        isExpanded: false,
        onChange: fn(),
    },
    render: (args) => <AccordionItemBlock data={mockData} isExpanded={args.isExpanded} onChange={args.onChange} />,
};

export const Expanded: Story = {
    args: {
        isExpanded: true,
        onChange: fn(),
    },
    render: (args) => <AccordionItemBlock data={mockData} isExpanded={args.isExpanded} onChange={args.onChange} />,
};

export const ClickToToggle: Story = {
    args: {
        isExpanded: false,
        onChange: fn(),
    },
    render: (args) => <AccordionItemBlock data={mockData} isExpanded={args.isExpanded} onChange={args.onChange} />,
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);
        const button = canvas.getByRole("button");

        await userEvent.click(button);
        await expect(args.onChange).toHaveBeenCalledTimes(1);
    },
};
