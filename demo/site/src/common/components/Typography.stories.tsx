import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Typography } from "./Typography";

const meta: Meta<typeof Typography> = {
    title: "Components/Typography",
    component: Typography,
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
        bottomSpacing: { control: "boolean" },
    },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Headline600: Story = {
    args: { variant: "headline600", children: "Headline 600" },
};

export const Headline550: Story = {
    args: { variant: "headline550", children: "Headline 550" },
};

export const Headline500: Story = {
    args: { variant: "headline500", children: "Headline 500" },
};

export const Headline450: Story = {
    args: { variant: "headline450", children: "Headline 450" },
};

export const Headline400: Story = {
    args: { variant: "headline400", children: "Headline 400" },
};

export const Headline350: Story = {
    args: { variant: "headline350", children: "Headline 350" },
};

export const Eyebrow600: Story = {
    args: { variant: "eyebrow600", children: "Eyebrow 600" },
};

export const Eyebrow550: Story = {
    args: { variant: "eyebrow550", children: "Eyebrow 550" },
};

export const Eyebrow500: Story = {
    args: { variant: "eyebrow500", children: "Eyebrow 500" },
};

export const Eyebrow450: Story = {
    args: { variant: "eyebrow450", children: "Eyebrow 450" },
};

export const Paragraph300: Story = {
    args: { variant: "paragraph300", children: "This is a paragraph with the paragraph300 variant. It uses the default paragraph styling." },
};

export const Paragraph200: Story = {
    args: { variant: "paragraph200", children: "This is a smaller paragraph with the paragraph200 variant." },
};

export const WithBottomSpacing: Story = {
    args: { variant: "headline500", children: "With Bottom Spacing", bottomSpacing: true },
};
