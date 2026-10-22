import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Icon } from "../../icon/Icon";
import { Button } from "../Button";
import { ButtonLink } from "../ButtonLink";
import styles from "./Button.stories.module.css";

const iconOptions = {
    plus: <Icon name="plus" />,
    "arrow-right": <Icon name="arrow-right" />,
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
        tone: { control: "radio", options: ["default", "danger", "success"] },
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
            <Button {...args} startIcon={<Icon name="plus" />}>
                Add product
            </Button>
            <Button {...args} variant="secondary" endIcon={<Icon name="arrow-right" />}>
                Next step
            </Button>
        </>
    ),
};

/**
 * A tone colors a button by what its action does: `danger` for an action that deletes or can't be undone,
 * `success` for one that completes something. Name the consequence in the label too.
 */
export const Tones: Story = {
    decorators: [inRow],
    render: (args) => (
        <>
            <Button {...args} tone="danger" startIcon={<Icon name="delete" />}>
                Delete product
            </Button>
            <Button {...args} tone="danger" variant="secondary">
                Discard changes
            </Button>
            <Button {...args} tone="danger" variant="ghost">
                Remove
            </Button>
            <Button {...args} tone="success" startIcon={<Icon name="check" />}>
                Publish
            </Button>
            <Button {...args} tone="success" variant="secondary">
                Approve
            </Button>
        </>
    ),
};

/**
 * An action that opens another page is a link: `ButtonLink` renders an `<a>` in the look of a button. For a
 * router's link, pass it as `render`, for example `render={<Link to="/products/new" />}`.
 */
export const AsLink: Story = {
    decorators: [inRow],
    render: () => (
        <>
            <ButtonLink href="#new-product" startIcon={<Icon name="plus" />}>
                Add product
            </ButtonLink>
            <ButtonLink href="#products" variant="secondary" endIcon={<Icon name="arrow-right" />}>
                All products
            </ButtonLink>
        </>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("link", { name: "Add product" })).toHaveAttribute("href", "#new-product");
    },
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
        startIcon: <Icon name="plus" />,
        slotProps: {
            startIcon: { className: styles.accentIcon },
        },
        children: "Add product",
    },
};
