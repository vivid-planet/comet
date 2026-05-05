import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { SpaceBlock } from "./SpaceBlock";

const meta: Meta<typeof SpaceBlock> = {
    title: "Blocks/SpaceBlock",
    component: SpaceBlock,
};

export default meta;
type Story = StoryObj<typeof SpaceBlock>;

export const Small: Story = {
    args: {
        data: { spacing: "s100" },
    },
    decorators: [
        (Story) => (
            <div>
                <div style={{ background: "#ddd", padding: 8 }}>Content above</div>
                <Story />
                <div style={{ background: "#ddd", padding: 8 }}>Content below</div>
            </div>
        ),
    ],
};

export const Medium: Story = {
    args: {
        data: { spacing: "s300" },
    },
    decorators: [
        (Story) => (
            <div>
                <div style={{ background: "#ddd", padding: 8 }}>Content above</div>
                <Story />
                <div style={{ background: "#ddd", padding: 8 }}>Content below</div>
            </div>
        ),
    ],
};

export const Large: Story = {
    args: {
        data: { spacing: "s600" },
    },
    decorators: [
        (Story) => (
            <div>
                <div style={{ background: "#ddd", padding: 8 }}>Content above</div>
                <Story />
                <div style={{ background: "#ddd", padding: 8 }}>Content below</div>
            </div>
        ),
    ],
};
