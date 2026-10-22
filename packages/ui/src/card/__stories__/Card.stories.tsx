import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Button } from "../../button/Button";
import { Chip } from "../../chip/Chip";
import { Icon } from "../../icon/Icon";
import { IconButton } from "../../iconButton/IconButton";
import { TextField } from "../../textField/TextField";
import { Typography } from "../../typography/Typography";
import { Card } from "../Card";
import styles from "./Card.stories.module.css";

const actionOptions = {
    EditButton: (
        <Button variant="secondary" size="small" startIcon={<Icon name="edit" />}>
            Edit
        </Button>
    ),
    MoreActionsButton: (
        <IconButton label="More actions" size="small">
            <Icon name="more" />
        </IconButton>
    ),
};

const inFrame: Decorator = (Story) => (
    <div className={styles.frame}>
        <Story />
    </div>
);

const meta = {
    component: Card,
    title: "Components/Card",
    // The docs page is Card.mdx.
    tags: ["!autodocs"],
    decorators: [inFrame],
    args: {
        title: "Billing address",
    },
    argTypes: {
        title: { control: "text" },
        description: { control: "text" },
        actions: { control: "select", options: Object.keys(actionOptions), mapping: actionOptions },
        // The content is JSX in the render functions, so that the documentation snippets show it as code.
        children: { control: false },
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
        render: { control: false },
        ref: { control: false },
    },
    render: (args) => (
        <Card {...args}>
            <Typography>Acme Corporation, 42 Harbour Street, 5020 Salzburg, Austria</Typography>
        </Card>
    ),
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A card groups content under a title, which is a level 2 heading, so screen reader users can jump from card
 * to card.
 */
export const Default: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("heading", { level: 2, name: "Billing address" })).toBeVisible();
    },
};

/**
 * The description explains the content, and `actions` hold the actions on the whole card at the end of the
 * header. On a narrow screen, they move below the title.
 */
export const WithDescriptionAndActions: Story = {
    args: {
        description: "Shown on your invoices and order confirmations.",
        actions: "EditButton",
    },
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByText("Shown on your invoices and order confirmations.")).toBeVisible();

        await userEvent.tab();
        await expect(canvas.getByRole("button", { name: "Edit" })).toHaveFocus();
    },
};

/**
 * A card around a group of fields makes a section of a longer form. The card doesn't lay out its content:
 * stack the fields with `--dextinity-space-xl` between them, as in "Patterns/Forms".
 */
export const FormSection: Story = {
    args: {
        title: "Contact person",
        description: "We contact this person about orders and invoices.",
    },
    render: (args) => (
        <Card {...args}>
            <div className={styles.fields}>
                <TextField label="Full name" name="name" autoComplete="name" required />
                <TextField label="Email address" name="email" type="email" autoComplete="email" required />
                <TextField label="Phone" name="phone" type="tel" autoComplete="tel" description="Only for urgent questions about a delivery." />
            </div>
        </Card>
    ),
    play: async ({ canvas, userEvent }) => {
        const name = canvas.getByRole("textbox", { name: "Full name" });

        await userEvent.type(name, "Ada Lovelace");
        await expect(name).toHaveValue("Ada Lovelace");
        await userEvent.tab();
        await expect(canvas.getByRole("textbox", { name: "Email address" })).toHaveFocus();
    },
};

/**
 * A card without a title, for content that names itself, such as a key figure on a dashboard. Leave out
 * `title`, `description` and `actions`, and the card renders no header.
 */
export const WithoutHeader: Story = {
    args: {
        title: undefined,
    },
    render: (args) => (
        <Card {...args}>
            <div className={styles.stat}>
                <Typography variant="label">Orders today</Typography>
                <Typography variant="heading2" render={<p />}>
                    128
                </Typography>
            </div>
        </Card>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.queryByRole("heading")).not.toBeInTheDocument();
        await expect(canvas.getByText("128")).toBeVisible();
    },
};

/**
 * Under a page section's heading, give the card titles the next level with `slotProps.title.render`, so the
 * page's outline stays in order. The text style stays the same.
 */
export const InASection: Story = {
    args: {
        title: "Billing address",
        slotProps: { title: { render: <h3 /> } },
    },
    render: (args) => (
        <section className={styles.stack} aria-labelledby="customer-heading">
            <Typography variant="heading3" render={<h2 id="customer-heading" />}>
                Customer
            </Typography>
            <Card {...args}>
                <Typography>Acme Corporation, 42 Harbour Street, 5020 Salzburg, Austria</Typography>
            </Card>
            <Card {...args} title="Shipping address">
                <Typography>Acme Warehouse, 7 Dock Road, 5020 Salzburg, Austria</Typography>
            </Card>
        </section>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("heading", { level: 2, name: "Customer" })).toBeVisible();
        await expect(canvas.getByRole("heading", { level: 3, name: "Billing address" })).toBeVisible();
        await expect(canvas.getByRole("heading", { level: 3, name: "Shipping address" })).toBeVisible();
    },
};

/**
 * `render` replaces the card's element, for example with `<li />` for each card of a list, so assistive
 * technology announces the number of cards. Safari drops the semantics of a list without bullets, unless the
 * list has `role="list"`.
 */
export const AsListItems: Story = {
    render: (args) => (
        <ul className={styles.list} role="list">
            <Card
                {...args}
                render={<li />}
                title="Order 1024"
                description="Placed today at 9:41"
                actions={
                    <IconButton label="More actions for order 1024" size="small">
                        <Icon name="more" />
                    </IconButton>
                }
            >
                <Chip tone="warning">Waiting for payment</Chip>
            </Card>
            <Card
                {...args}
                render={<li />}
                title="Order 1023"
                description="Placed yesterday at 16:05"
                actions={
                    <IconButton label="More actions for order 1023" size="small">
                        <Icon name="more" />
                    </IconButton>
                }
            >
                <Chip tone="success">Shipped</Chip>
            </Card>
        </ul>
    ),
    play: async ({ canvas }) => {
        const items = canvas.getAllByRole("listitem");

        await expect(items).toHaveLength(2);
        await expect(items[0]).toHaveClass("dextinityCard");
        await expect(canvas.getByRole("heading", { level: 2, name: "Order 1024" })).toBeVisible();
    },
};

/**
 * `className` styles the card itself, `slotProps` its inner parts. Both are added to the component's own
 * classes: here a border in the primary color and a line between the header and the content. See
 * "Foundations/Customization" for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        description: "Shown on your invoices and order confirmations.",
        className: styles.highlightedCard,
        slotProps: {
            header: { className: styles.dividedHeader },
        },
    },
};
