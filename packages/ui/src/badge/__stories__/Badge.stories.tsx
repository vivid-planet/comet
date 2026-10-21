import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "../../typography/Typography";
import { Badge } from "../Badge";
import styles from "./Badge.stories.module.css";

const meta = {
    component: Badge,
    title: "Components/Badge",
    args: {
        children: "Draft",
    },
    argTypes: {
        tone: { control: "select", options: ["neutral", "primary", "success", "warning", "danger"] },
        children: { control: "text" },
        className: { control: false },
        render: { control: false },
    },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

const inRow: Decorator = (Story) => (
    <div className={styles.row}>
        <Story />
    </div>
);

/**
 * A status that needs no emphasis.
 *
 * @summary A neutral badge.
 */
export const Default: Story = {};

/**
 * Pick the tone by what the status means. The text names the status on its own; the color only supports it.
 *
 * @summary The neutral, primary, success, warning and danger tones.
 */
export const Tones: Story = {
    decorators: [inRow],
    render: () => (
        <>
            <Badge tone="neutral">Draft</Badge>
            <Badge tone="primary">New</Badge>
            <Badge tone="success">Published</Badge>
            <Badge tone="warning">Low stock</Badge>
            <Badge tone="danger">Out of stock</Badge>
        </>
    ),
};

/**
 * The status of the item a heading names. Place the badge after the heading rather than inside it, so it
 * doesn't become part of the heading's text in the document outline, and align both in a row, for example
 * with `display: flex; align-items: center`.
 *
 * @summary A badge next to a heading.
 */
export const NextToAHeading: Story = {
    decorators: [inRow],
    render: () => (
        <>
            <Typography variant="heading2">Linen shirt</Typography>
            <Badge tone="success">Published</Badge>
        </>
    ),
};
