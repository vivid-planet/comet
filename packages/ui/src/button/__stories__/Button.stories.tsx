import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { AddIcon, ArrowRightIcon } from "#storybook/icons";

import { Button } from "../Button";
import styles from "./Button.stories.module.css";

const iconOptions = {
    AddIcon: <AddIcon />,
    ArrowRightIcon: <ArrowRightIcon />,
};

const meta = {
    component: Button,
    title: "Components/Button",
    // The docs page is Button.mdx.
    tags: ["!autodocs"],
    args: {
        children: "Save changes",
        onClick: fn(),
    },
    argTypes: {
        variant: { control: "radio", options: ["primary", "secondary", "ghost"] },
        size: { control: "radio", options: ["small", "medium", "large"] },
        startIcon: { control: "select", options: Object.keys(iconOptions), mapping: iconOptions },
        endIcon: { control: "select", options: Object.keys(iconOptions), mapping: iconOptions },
        className: { control: false },
        slotProps: { control: false },
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

const inRow: Decorator = (Story) => (
    <div className={styles.row}>
        <Story />
    </div>
);

/**
 * The main action of a page or dialog.
 */
export const Default: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Save changes" }));
        await expect(args.onClick).toHaveBeenCalledOnce();

        await userEvent.keyboard("{Enter}");
        await expect(args.onClick).toHaveBeenCalledTimes(2);
    },
};

/**
 * Actions next to the main action, such as "Cancel".
 */
export const Secondary: Story = {
    args: {
        variant: "secondary",
        children: "Cancel",
    },
};

/**
 * Less important actions, such as in a toolbar or a dense list.
 */
export const Ghost: Story = {
    args: {
        variant: "ghost",
        children: "Show details",
    },
};

/**
 * Use one size for all buttons in a group.
 */
export const Sizes: Story = {
    decorators: [inRow],
    render: (args) => (
        <>
            <Button {...args} size="small">
                Small
            </Button>
            <Button {...args} size="medium">
                Medium
            </Button>
            <Button {...args} size="large">
                Large
            </Button>
        </>
    ),
};

/**
 * An icon supports the text, it doesn't replace it. For a button that only shows an icon, use `IconButton`.
 */
export const WithIcons: Story = {
    decorators: [inRow],
    render: (args) => (
        <>
            <Button {...args} startIcon={<AddIcon />}>
                Add product
            </Button>
            <Button {...args} variant="secondary" endIcon={<ArrowRightIcon />}>
                Next step
            </Button>
        </>
    ),
};

/**
 * A disabled button doesn't react to clicks. Prefer explaining why an action isn't available over only
 * disabling it.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
    },
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Save changes" }));
        await expect(args.onClick).not.toHaveBeenCalled();
    },
};

/**
 * `className` styles the button itself, `slotProps` its inner parts. Both are added to the component's own
 * classes. See "Foundations/Customization" for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        variant: "secondary",
        className: styles.wideButton,
        startIcon: <AddIcon />,
        slotProps: {
            startIcon: { className: styles.accentIcon },
        },
        children: "Add product",
    },
};
