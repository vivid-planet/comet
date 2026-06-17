import { ArrowRight, Favorite } from "@comet/admin-icons";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button";

const meta: Meta<typeof Button> = {
    component: Button,
    title: "Future UI/Button",
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: "Button",
        variant: "primary",
    },
};

export const Secondary: Story = {
    args: {
        children: "Button",
        variant: "secondary",
    },
};

/**
 * `startIcon` and `endIcon` accept any `ReactNode`.
 */
export const WithIcons: Story = {
    render: () => (
        <div style={{ display: "flex", gap: "1rem" }}>
            <Button startIcon={<Favorite />}>Start only</Button>
            <Button endIcon={<ArrowRight />}>End only</Button>
            <Button startIcon={<Favorite />} endIcon={<ArrowRight />}>
                Both
            </Button>
        </div>
    ),
};

/**
 * Native button props (`onClick`, ARIA attributes, `type`, …) are part of
 * the top-level surface.
 */
export const WithClickHandler: Story = {
    args: {
        children: "Click me",
        onClick: () => {
            window.alert("Clicked");
        },
    },
};
