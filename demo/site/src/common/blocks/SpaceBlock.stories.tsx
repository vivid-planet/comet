import type { SpaceBlockData } from "@src/blocks.generated";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SpaceBlock } from "./SpaceBlock";

const meta: Meta = {
    title: "Blocks/SpaceBlock",
    argTypes: {
        spacing: {
            control: "select",
            options: ["d100", "d200", "d300", "d400", "s100", "s200", "s300", "s400", "s500", "s600"],
        },
    },
    render: (args) => (
        <div>
            <div style={{ background: "#e0e0e0", padding: "8px" }}>Content above</div>
            <SpaceBlock data={args as SpaceBlockData} />
            <div style={{ background: "#e0e0e0", padding: "8px" }}>Content below</div>
        </div>
    ),
};

export default meta;
type Story = StoryObj;

export const Small: Story = {
    args: {
        spacing: "s100",
    },
};

export const Medium: Story = {
    args: {
        spacing: "d200",
    },
};

export const Large: Story = {
    args: {
        spacing: "d400",
    },
};
