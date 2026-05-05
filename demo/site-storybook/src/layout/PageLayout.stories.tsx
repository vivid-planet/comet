import { PageLayout } from "@src/layout/PageLayout";
import type { Meta, StoryObj } from "@storybook/react-webpack5";

const meta: Meta<typeof PageLayout> = {
    title: "Layout/PageLayout",
    component: PageLayout,
};

export default meta;
type Story = StoryObj<typeof PageLayout>;

export const Default: Story = {
    args: {
        children: (
            <div style={{ background: "#f0f0f0", padding: 24 }}>
                <p>Content inside a default PageLayout (no grid)</p>
            </div>
        ),
    },
};

export const WithGrid: Story = {
    args: {
        grid: true,
        children: (
            <div style={{ background: "#f0f0f0", padding: 24 }}>
                <p>Content inside a PageLayout with grid enabled</p>
            </div>
        ),
    },
};
