import type { Meta, StoryObj } from "@storybook/react-vite";

import { PageLayout } from "./PageLayout";

const meta: Meta<typeof PageLayout> = {
    component: PageLayout,
    title: "Layout/PageLayout",
    argTypes: {
        grid: { control: "boolean" },
    },
};

export default meta;
type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
    args: {
        children: (
            <div style={{ padding: "20px", background: "#f0f0f0" }}>
                <p>Content inside PageLayout (default)</p>
            </div>
        ),
    },
};

export const WithGrid: Story = {
    args: {
        grid: true,
        children: (
            <div style={{ padding: "20px", background: "#f0f0f0" }}>
                <p>Content inside PageLayout (with grid)</p>
            </div>
        ),
    },
};
