import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Button } from "../../button/Button";
import { Typography } from "../../typography/Typography";
import { Icon } from "../Icon";
import { iconNames } from "../iconNames";
import styles from "./Icon.stories.module.css";

const meta = {
    component: Icon,
    title: "Components/Icon",
    // The docs page is Icon.mdx.
    tags: ["!autodocs"],
    args: {
        name: "edit",
    },
    argTypes: {
        name: { control: "select", options: iconNames },
        label: { control: "text" },
        className: { control: false },
        style: { control: false },
    },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * An icon of the icon set, 1em large and in the color of the text around it. Without a label, it is
 * decorative and hidden from assistive technology.
 */
export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(canvasElement.querySelector(".dextinityIcon")).toHaveAttribute("aria-hidden", "true");
    },
};

/**
 * An icon that is the only thing saying something, here that a product is low on stock, gets a `label`, which
 * assistive technology announces.
 */
export const WithLabel: Story = {
    args: {
        name: "warning",
        label: "Low stock",
    },
    render: (args) => (
        <Typography render={<p />} className={styles.row}>
            Linen shirt
            <Icon {...args} className={styles.warning} />
        </Typography>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("img", { name: "Low stock" })).toBeVisible();
    },
};

/**
 * The icon is as large as the font size and has the text color, so `font-size` and `color` set its size and
 * color, here through a class.
 */
export const SizeAndColor: Story = {
    render: (args) => (
        <div className={styles.row}>
            <Icon {...args} />
            <Icon {...args} className={styles.large} />
            <Icon {...args} className={styles.largePrimary} />
        </div>
    ),
};

/**
 * Components that take an icon, such as `Button`, size and color it themselves.
 */
export const InAButton: Story = {
    args: {
        name: "plus",
    },
    render: (args) => <Button startIcon={<Icon {...args} />}>Add product</Button>,
};
