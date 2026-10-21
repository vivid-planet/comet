import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "../Typography";
import styles from "./Typography.stories.module.css";

const meta = {
    component: Typography,
    title: "Components/Typography",
    args: {
        children: "Orders placed before 2 pm ship the same day.",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["display", "heading1", "heading2", "heading3", "heading4", "bodyLarge", "body", "bodySmall", "label", "overline"],
        },
        tone: { control: "radio", options: ["default", "muted"] },
        children: { control: "text" },
        className: { control: false },
        render: { control: false },
    },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

const stacked: Decorator = (Story) => (
    <div className={styles.stack}>
        <Story />
    </div>
);

/**
 * Running text, rendered as a paragraph.
 *
 * @summary A paragraph in the body style.
 */
export const Default: Story = {};

/**
 * Titles for the page, its sections and its cards. Each heading variant renders the matching heading element,
 * so the visual hierarchy and the document outline agree.
 *
 * @summary The display style and the four heading levels.
 */
export const Headings: Story = {
    decorators: [stacked],
    render: () => (
        <>
            <Typography variant="display">Welcome back</Typography>
            <Typography variant="heading1">Products</Typography>
            <Typography variant="heading2">Shipping</Typography>
            <Typography variant="heading3">Delivery times</Typography>
            <Typography variant="heading4">Shipping address</Typography>
        </>
    ),
};

/**
 * A lead paragraph, running text and secondary text.
 *
 * @summary The body large, body and body small styles.
 */
export const BodyText: Story = {
    decorators: [stacked],
    render: () => (
        <>
            <Typography variant="bodyLarge">Everything you need to know about shipping your order.</Typography>
            <Typography variant="body">Orders placed before 2 pm ship the same day. You receive the tracking link by email.</Typography>
            <Typography variant="bodySmall">Delivery times may be longer on public holidays.</Typography>
        </>
    ),
};

/**
 * Secondary text, such as a date or a hint, that should draw less attention than the text around it.
 *
 * @summary Secondary text in the muted color.
 */
export const Muted: Story = {
    args: {
        variant: "bodySmall",
        tone: "muted",
        children: "Last edited 3 hours ago",
    },
};

/**
 * An overline names the category of the heading below it. A label names a value, such as a product's status.
 *
 * @summary An overline above a heading, and a label above its value.
 */
export const OverlineAndLabel: Story = {
    decorators: [stacked],
    render: () => (
        <>
            <div>
                <Typography variant="overline">Spring collection</Typography>
                <Typography variant="heading2">New arrivals</Typography>
            </div>
            <div>
                <Typography variant="label">Status</Typography>
                <Typography variant="body">Published</Typography>
            </div>
        </>
    ),
};

/**
 * `render` replaces the element and keeps the style. Here, a card title looks like a heading 4 but is a
 * section of the page, so it is an `h2` in the document outline.
 *
 * @summary A heading 4 style on an `h2` element, through `render`.
 */
export const DifferentElement: Story = {
    args: {
        variant: "heading4",
        render: <h2 />,
        children: "Shipping address",
    },
};
