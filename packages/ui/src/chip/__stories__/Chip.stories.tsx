import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import { Typography } from "../../typography/Typography";
import { Chip } from "../Chip";
import styles from "./Chip.stories.module.css";

const meta = {
    component: Chip,
    title: "Components/Chip",
    // The docs page is Chip.mdx.
    tags: ["!autodocs"],
    args: {
        children: "Draft",
    },
    argTypes: {
        tone: { control: "select", options: ["neutral", "primary", "success", "warning", "danger"] },
        children: { control: "text" },
        className: { control: false },
        render: { control: false },
    },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

const inRow: Decorator = (Story) => (
    <div className={styles.row}>
        <Story />
    </div>
);

/**
 * A status that needs no emphasis.
 */
export const Default: Story = {};

/**
 * Pick the tone by what the status means. The text names the status on its own; the color only supports it.
 */
export const Tones: Story = {
    decorators: [inRow],
    render: () => (
        <>
            <Chip tone="neutral">Draft</Chip>
            <Chip tone="primary">New</Chip>
            <Chip tone="success">Published</Chip>
            <Chip tone="warning">Low stock</Chip>
            <Chip tone="danger">Out of stock</Chip>
        </>
    ),
};

/**
 * The status of the item a heading names. Place the chip after the heading rather than inside it, so it
 * doesn't become part of the heading's text in the document outline, and align both in a row, for example
 * with `display: flex; align-items: center`.
 */
export const NextToAHeading: Story = {
    decorators: [inRow],
    render: () => (
        <>
            <Typography variant="heading2">Linen shirt</Typography>
            <Chip tone="success">Published</Chip>
        </>
    ),
};
