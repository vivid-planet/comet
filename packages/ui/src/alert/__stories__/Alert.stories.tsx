import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";

import { Button } from "../../button/Button";
import { Icon } from "../../icon/Icon";
import { Alert } from "../Alert";
import styles from "./Alert.stories.module.css";

const actionOptions = {
    none: undefined,
    Button: (
        <Button size="small" variant="secondary">
            Review order
        </Button>
    ),
};

const iconOptions = {
    "tone's icon": undefined,
    none: false,
    bell: <Icon name="bell" />,
    help: <Icon name="help" />,
};

const roleOptions = {
    "no role": undefined,
    status: "status",
    alert: "alert",
};

const meta = {
    component: Alert,
    title: "Components/Alert",
    // The docs page is Alert.mdx.
    tags: ["!autodocs"],
    args: {
        children: "Prices include VAT. Shipping costs are added at checkout.",
    },
    argTypes: {
        tone: { control: "select", options: ["info", "success", "warning", "danger"] },
        title: { control: "text" },
        children: { control: "text" },
        action: { control: "select", options: Object.keys(actionOptions), mapping: actionOptions },
        icon: { control: "select", options: Object.keys(iconOptions), mapping: iconOptions },
        role: { control: "radio", options: Object.keys(roleOptions), mapping: roleOptions },
        closeLabel: { control: "text" },
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
        ref: { control: false },
    },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

const inColumn: Decorator = (Story) => (
    <div className={styles.stack}>
        <Story />
    </div>
);

/**
 * Neutral information about the page, such as a hint above a form.
 */
export const Default: Story = {};

/**
 * Pick the tone by what the message means. The text says it on its own; the color and the icon only support it.
 */
export const Tones: Story = {
    decorators: [inColumn],
    render: (args) => (
        <>
            <Alert {...args} tone="info">
                Orders placed after 2 pm ship the next working day.
            </Alert>
            <Alert {...args} tone="success">
                The product is published and visible in the shop.
            </Alert>
            <Alert {...args} tone="warning">
                Only 3 items are left in stock.
            </Alert>
            <Alert {...args} tone="danger">
                Saving failed. Check your connection and try again.
            </Alert>
        </>
    ),
};

/**
 * A title summarizes a longer message, and an action lets the user act on it. With a title, the action is below
 * the message.
 */
export const WithTitleAndAction: Story = {
    args: {
        tone: "danger",
        title: "Upload failed",
        children: "The image is larger than 10 MB. Upload a smaller file or compress it first.",
    },
    render: (args) => (
        <Alert
            {...args}
            action={
                <Button size="small" variant="primary">
                    Try again
                </Button>
            }
        />
    ),
};

/**
 * Without a title, the action follows the message on the same line when both fit, and moves below it in a narrow
 * container.
 */
export const WithAction: Story = {
    args: {
        tone: "warning",
        children: "3 orders are waiting for payment.",
    },
    render: (args) => (
        <Alert
            {...args}
            action={
                <Button size="small" variant="secondary">
                    Review order
                </Button>
            }
        />
    ),
};

/**
 * A close button lets the user dismiss a message they have read. `closeLabel` names it; remove the alert in
 * `onClose`.
 */
export const Dismissible: Story = {
    args: {
        title: "New: bulk editing",
        children: "Select several products in the list to change their prices at once.",
        closeLabel: "Close",
        onClose: fn(),
    },
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Close" }));
        await expect(args.onClose).toHaveBeenCalledOnce();
    },
};

/**
 * Replace the tone's icon with one that fits the message better. To announce the tone to screen readers, give
 * the icon a `label`.
 */
export const WithReplacedIcon: Story = {
    args: {
        icon: <Icon name="bell" />,
        children: "You'll get an email when the product is back in stock.",
    },
};

/**
 * Without an icon, for example where space is tight or several alerts are stacked.
 */
export const WithoutIcon: Story = {
    args: {
        icon: false,
    },
};

/**
 * An urgent message that appears after the user's action, such as an error after submitting, has `role="alert"`, so
 * screen readers announce it as soon as it appears. A message that can wait is announced reliably only from an
 * element with `role="status"` that is on the page before the message.
 */
export const AnnouncedAfterAnAction: Story = {
    decorators: [inColumn],
    parameters: {
        // The rendered code would show the page before the click, without the alert.
        docs: { source: { type: "code" } },
    },
    render: function AnnouncedAlert() {
        const [hasError, setHasError] = useState(false);

        return (
            <>
                <Button className={styles.trigger} onClick={() => setHasError(true)}>
                    Publish
                </Button>
                {hasError && (
                    <Alert tone="danger" role="alert" title="The product couldn't be published">
                        Add a price before publishing the product.
                    </Alert>
                )}
            </>
        );
    },
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();

        await userEvent.click(canvas.getByRole("button", { name: "Publish" }));
        await expect(await canvas.findByRole("alert")).toHaveTextContent("Add a price before publishing the product.");
    },
};

/**
 * `className` styles the alert itself, `slotProps` its inner parts. Both are added to the component's own
 * classes. See "Foundations/Customization" for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        tone: "warning",
        title: "Maintenance",
        children: "The shop is read-only on Sunday from 6 to 8 am.",
        className: styles.accentAlert,
        slotProps: {
            title: { className: styles.overlineTitle },
        },
    },
};
