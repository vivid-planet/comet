import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FormEvent } from "react";

import { Button } from "../../button/Button";
import { Checkbox } from "../../checkbox/Checkbox";
import { Radio } from "../../radioGroup/Radio";
import { RadioGroup } from "../../radioGroup/RadioGroup";
import { Switch } from "../../switch/Switch";
import { TextField } from "../../textField/TextField";
import { Typography } from "../../typography/Typography";
import styles from "./Forms.stories.module.css";

const meta = {
    title: "Patterns/Forms/Examples",
    tags: ["!dev", "!autodocs", "!manifest"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function preventSubmit(event: FormEvent) {
    event.preventDefault();
}

/**
 * A form that is submitted: one column, related fields under a heading, the actions at the end.
 */
export const CheckoutForm: Story = {
    render: () => (
        <form className={styles.form} onSubmit={preventSubmit}>
            <Typography variant="heading4" render={<h2 />}>
                Shipping details
            </Typography>
            <TextField label="Full name" name="name" autoComplete="name" required />
            <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                description="We send the order confirmation to this address."
                required
            />
            <RadioGroup label="Delivery" name="delivery" defaultValue="standard">
                <Radio value="standard">Standard, 3–5 working days</Radio>
                <Radio value="express">Express, next working day</Radio>
                <Radio value="pickup">Pickup in store</Radio>
            </RadioGroup>
            <Checkbox name="newsletter">Subscribe to the newsletter</Checkbox>
            <div className={styles.actions}>
                <Button type="submit">Place order</Button>
                <Button variant="secondary">Back to cart</Button>
            </div>
        </form>
    ),
};

/**
 * The same form after a failed submit: each invalid field says how to fix it.
 */
export const CheckoutFormWithErrors: Story = {
    render: () => (
        <form className={styles.form} onSubmit={preventSubmit}>
            <Typography variant="heading4" render={<h2 />}>
                Shipping details
            </Typography>
            <TextField label="Full name" name="name" autoComplete="name" required defaultValue="Ada Lovelace" />
            <TextField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue="ada.lovelace"
                error="Enter an email address in the format name@example.com."
            />
            <RadioGroup label="Delivery" name="delivery" required error="Choose how you want to receive the order.">
                <Radio value="standard">Standard, 3–5 working days</Radio>
                <Radio value="express">Express, next working day</Radio>
                <Radio value="pickup">Pickup in store</Radio>
            </RadioGroup>
            <div className={styles.actions}>
                <Button type="submit">Place order</Button>
                <Button variant="secondary">Back to cart</Button>
            </div>
        </form>
    ),
};

/**
 * Settings that take effect immediately use switches and need no submit button.
 */
export const ImmediateSettings: Story = {
    render: () => (
        <section className={styles.form} aria-labelledby="notifications-heading">
            <Typography variant="heading4" render={<h2 id="notifications-heading" />}>
                Notifications
            </Typography>
            <Switch defaultChecked>Email me when an order is placed</Switch>
            <Switch>Email me a weekly summary</Switch>
        </section>
    ),
};
