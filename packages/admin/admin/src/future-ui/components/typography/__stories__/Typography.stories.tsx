import type { Meta, StoryObj } from "@storybook/react-vite";

import { cssVarsProviderDecorator } from "../../../storybook/cssVarsProviderDecorator";
import { Typography } from "../Typography";

const meta: Meta<typeof Typography> = {
    component: Typography,
    title: "Future UI/Typography",
    decorators: [cssVarsProviderDecorator],
    argTypes: {
        variant: {
            control: "select",
            options: ["headline", "body"],
        },
        element: {
            control: "select",
            options: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"],
        },
    },
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Default: Story = {
    args: {
        children: "The quick brown fox jumps over the lazy dog",
    },
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Typography variant="headline">Headline</Typography>
            <Typography variant="body">Body — the quick brown fox jumps over the lazy dog.</Typography>
        </div>
    ),
};

/**
 * Each variant maps to a default semantic element (`h2` for `headline`, `p`
 * for `body`). `element` overrides it when visual level and document outline
 * disagree — for example, a `headline` rendered as an `h1`.
 */
export const WithCustomElement: Story = {
    args: {
        variant: "headline",
        element: "h1",
        children: "Visually headline, semantically h1",
    },
};

/**
 * `render` replaces the root element while keeping Typography's styling. Here a
 * `headline` renders as a `<label>`, with `htmlFor` typed natively.
 */
export const WithRender: Story = {
    args: {
        variant: "headline",
        render: <label htmlFor="email" />,
        children: "Email",
    },
};
