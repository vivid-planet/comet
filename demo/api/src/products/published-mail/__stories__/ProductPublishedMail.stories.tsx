import { type Meta, type StoryObj } from "@storybook/react-vite";

import { Mail } from "../Mail";

type Story = StoryObj<typeof Mail>;

const config: Meta = {
    title: "products/ProductPublishedMail",
    component: Mail,
    argTypes: {
        countProductPublished: {
            control: "select",
            options: [1, 5, 10, "all"],
        },
    },
};

export default config;

export const Primary: Story = {
    args: {
        recipient: { name: "John Doe", email: "product-manager@comet-dxp.com", language: "en" },
        countProductPublished: 1,
    },
};
