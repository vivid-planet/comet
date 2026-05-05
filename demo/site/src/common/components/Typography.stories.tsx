import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "./Typography";

const meta: Meta<typeof Typography> = {
    component: Typography,
    title: "Components/Typography",
    argTypes: {
        variant: {
            control: "select",
            options: [
                "headline600",
                "headline550",
                "headline500",
                "headline450",
                "headline400",
                "headline350",
                "eyebrow600",
                "eyebrow550",
                "eyebrow500",
                "eyebrow450",
                "paragraph300",
                "paragraph200",
            ],
        },
        bottomSpacing: {
            control: "boolean",
        },
        children: {
            control: "text",
        },
    },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Headline600: Story = {
    args: {
        variant: "headline600",
        children: "Headline 600",
    },
};

export const Headline550: Story = {
    args: {
        variant: "headline550",
        children: "Headline 550",
    },
};

export const Headline500: Story = {
    args: {
        variant: "headline500",
        children: "Headline 500",
    },
};

export const Headline450: Story = {
    args: {
        variant: "headline450",
        children: "Headline 450",
    },
};

export const Headline400: Story = {
    args: {
        variant: "headline400",
        children: "Headline 400",
    },
};

export const Headline350: Story = {
    args: {
        variant: "headline350",
        children: "Headline 350",
    },
};

export const Paragraph300: Story = {
    args: {
        variant: "paragraph300",
        children: "This is a paragraph with variant paragraph300. It uses the default paragraph styling.",
    },
};

export const Paragraph200: Story = {
    args: {
        variant: "paragraph200",
        children: "This is a paragraph with variant paragraph200. It uses a smaller paragraph styling.",
    },
};

export const WithBottomSpacing: Story = {
    args: {
        variant: "headline500",
        children: "Headline with bottom spacing",
        bottomSpacing: true,
    },
    render: (args) => (
        <div>
            <Typography {...args} />
            <Typography variant="paragraph300">This paragraph appears below the headline with spacing.</Typography>
        </div>
    ),
};

export const AllVariants: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Typography variant="headline600">Headline 600</Typography>
            <Typography variant="headline550">Headline 550</Typography>
            <Typography variant="headline500">Headline 500</Typography>
            <Typography variant="headline450">Headline 450</Typography>
            <Typography variant="headline400">Headline 400</Typography>
            <Typography variant="headline350">Headline 350</Typography>
            <Typography variant="eyebrow600">Eyebrow 600</Typography>
            <Typography variant="eyebrow550">Eyebrow 550</Typography>
            <Typography variant="eyebrow500">Eyebrow 500</Typography>
            <Typography variant="eyebrow450">Eyebrow 450</Typography>
            <Typography variant="paragraph300">Paragraph 300</Typography>
            <Typography variant="paragraph200">Paragraph 200</Typography>
        </div>
    ),
};
