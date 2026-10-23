import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { type FormEvent, useState } from "react";
import { expect, fn, screen, waitFor, within } from "storybook/test";

import { afterEffects } from "#storybook/afterEffects";

import { Button } from "../../button/Button";
import { Icon } from "../../icon/Icon";
import { IconButton } from "../../iconButton/IconButton";
import { TextField } from "../../textField/TextField";
import { ThemeSwitch } from "../../themeSwitch/ThemeSwitch";
import { Tooltip } from "../../tooltip/Tooltip";
import { Typography } from "../../typography/Typography";
import { Dialog } from "../Dialog";
import { DialogClose } from "../DialogClose";
import styles from "./Dialog.stories.module.css";

const triggerOptions = {
    Button: <Button variant="secondary">Show shipping details</Button>,
    none: undefined,
};

const actionOptions = {
    none: undefined,
    "Cancel and Save": (
        <>
            <DialogClose>
                <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose>
                <Button>Save</Button>
            </DialogClose>
        </>
    ),
};

const meta = {
    component: Dialog,
    subcomponents: { DialogClose },
    title: "Components/Dialog",
    // The docs page is Dialog.mdx.
    tags: ["!autodocs"],
    args: {
        trigger: <Button variant="secondary">Show shipping details</Button>,
        title: "Shipping details",
        onOpenChange: fn(),
    },
    argTypes: {
        trigger: { control: "select", options: Object.keys(triggerOptions), mapping: triggerOptions },
        title: { control: "text" },
        description: { control: "text" },
        actions: { control: "select", options: Object.keys(actionOptions), mapping: actionOptions },
        closeLabel: { control: "text" },
        size: { control: "radio", options: ["small", "medium", "large"] },
        // The content is JSX in the render functions, so that the documentation snippets show it as code.
        children: { control: false },
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
        actionsRef: { control: false },
        initialFocus: { control: false },
        finalFocus: { control: false },
    },
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

const inColumn: Decorator = (Story) => (
    <div className={styles.stack}>
        <Story />
    </div>
);

/**
 * Information on top of the page, opened by its `trigger` and closed with the button in the corner, Escape or
 * a click beside the dialog. Focus moves into the dialog and returns to the trigger when it closes.
 */
export const Default: Story = {
    args: {
        closeLabel: "Close",
    },
    render: (args) => (
        <Dialog {...args}>
            Orders placed before 2 pm ship the same working day. Delivery takes one to two working days within Austria and Germany.
        </Dialog>
    ),
    play: async ({ args, canvas, userEvent }) => {
        const trigger = canvas.getByRole("button", { name: "Show shipping details" });
        await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

        await userEvent.click(trigger);
        const dialog = await screen.findByRole("dialog", { name: "Shipping details" });
        await waitFor(() => expect(dialog).toBeVisible());
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());
        const closeButton = within(dialog).getByRole("button", { name: "Close" });
        await waitFor(() => expect(closeButton).toHaveFocus());

        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
        await waitFor(() => expect(trigger).toHaveFocus());

        await userEvent.keyboard("{Enter}");
        const reopenedDialog = await screen.findByRole("dialog", { name: "Shipping details" });
        await userEvent.click(within(reopenedDialog).getByRole("button", { name: "Close" }));
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        await waitFor(() => expect(trigger).toHaveFocus());

        await userEvent.click(trigger);
        const viewport = (await screen.findByRole("dialog", { name: "Shipping details" })).closest(".dextinityDialog__viewport");
        await userEvent.click(viewport as Element);
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        await waitFor(() => expect(trigger).toHaveFocus());
    },
};

const deleteProduct = fn();

/**
 * A question before a destructive action. The title asks it, the description names what gets lost, and the
 * buttons repeat the action instead of "Yes" and "No". `DialogClose` makes "Cancel" close the dialog and
 * "Delete" run its action and close it too. Focus starts on "Cancel", so pressing Enter right away deletes
 * nothing. The `small` size suits a dialog without content.
 */
export const ConfirmDelete: Story = {
    args: {
        trigger: (
            <Button variant="secondary" startIcon={<Icon name="delete" />}>
                Delete product
            </Button>
        ),
        title: "Delete product?",
        description: "This permanently deletes “Summer T-shirt” and its 3 variants. You can't undo this.",
        size: "small",
    },
    render: (args) => (
        <Dialog
            {...args}
            actions={
                <>
                    <DialogClose>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose>
                        <Button onClick={deleteProduct}>Delete</Button>
                    </DialogClose>
                </>
            }
        />
    ),
    play: async ({ canvas, userEvent }) => {
        deleteProduct.mockClear();
        const trigger = canvas.getByRole("button", { name: "Delete product" });

        await userEvent.click(trigger);
        const dialog = await screen.findByRole("dialog", { name: "Delete product?" });
        await expect(dialog).toHaveAccessibleDescription("This permanently deletes “Summer T-shirt” and its 3 variants. You can't undo this.");
        await expect(dialog).toHaveAttribute("data-size", "small");
        await waitFor(() => expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus());

        await userEvent.keyboard("{Enter}");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        await expect(deleteProduct).not.toHaveBeenCalled();
        await waitFor(() => expect(trigger).toHaveFocus());

        await userEvent.click(trigger);
        await userEvent.click(within(await screen.findByRole("dialog")).getByRole("button", { name: "Delete" }));
        await expect(deleteProduct).toHaveBeenCalledOnce();
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    },
};

const saveProduct = fn();

/**
 * Fields in a dialog, for a few changes to an item without leaving the page. The form is the content and its
 * submit button one of the actions, connected through the form's `id`. The dialog is controlled, so it closes
 * only after the form is saved; an invalid form stays open. `disablePointerDismissal` keeps it open on a click
 * beside it, so the input isn't lost by accident; Escape, "Cancel" and the close button still close it. For a
 * longer form, use a page instead.
 */
export const EditForm: Story = {
    args: {
        trigger: <Button variant="secondary">Edit product</Button>,
        title: "Edit product",
        description: "Changes are visible in the shop right after saving.",
        closeLabel: "Close",
        disablePointerDismissal: true,
    },
    render: function EditFormDialog(args) {
        const [open, setOpen] = useState(false);

        function handleSubmit(event: FormEvent<HTMLFormElement>) {
            event.preventDefault();
            saveProduct(Object.fromEntries(new FormData(event.currentTarget)));
            setOpen(false);
        }

        return (
            <Dialog
                {...args}
                open={open}
                onOpenChange={setOpen}
                actions={
                    <>
                        <DialogClose>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" form="edit-product">
                            Save
                        </Button>
                    </>
                }
            >
                <form id="edit-product" className={styles.form} onSubmit={handleSubmit}>
                    <TextField label="Name" name="name" defaultValue="Summer T-shirt" required />
                    <TextField label="Article number" name="articleNumber" defaultValue="TS-1024" description="As printed on the label." />
                </form>
            </Dialog>
        );
    },
    play: async ({ canvas, userEvent }) => {
        saveProduct.mockClear();
        const trigger = canvas.getByRole("button", { name: "Edit product" });

        await userEvent.click(trigger);
        const dialog = await screen.findByRole("dialog", { name: "Edit product" });
        const nameInput = within(dialog).getByRole("textbox", { name: "Name" });
        await waitFor(() => expect(nameInput).toHaveFocus());

        await userEvent.type(nameInput, " (new)");
        await userEvent.click(dialog.closest(".dextinityDialog__viewport") as Element);
        await new Promise((resolve) => setTimeout(resolve, 200));
        await expect(dialog).toBeVisible();
        await expect(nameInput).toHaveValue("Summer T-shirt (new)");

        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        await waitFor(() => expect(trigger).toHaveFocus());
        await expect(saveProduct).not.toHaveBeenCalled();

        await userEvent.click(trigger);
        const reopenedDialog = await screen.findByRole("dialog", { name: "Edit product" });
        const reopenedNameInput = within(reopenedDialog).getByRole("textbox", { name: "Name" });
        await waitFor(() => expect(reopenedNameInput).toHaveFocus());

        await userEvent.clear(reopenedNameInput);
        await userEvent.click(within(reopenedDialog).getByRole("button", { name: "Save" }));
        await expect(saveProduct).not.toHaveBeenCalled();
        await expect(reopenedDialog).toBeInTheDocument();

        await userEvent.type(reopenedNameInput, "Summer shirt");
        await userEvent.click(within(reopenedDialog).getByRole("button", { name: "Save" }));
        await expect(saveProduct).toHaveBeenCalledWith({ name: "Summer shirt", articleNumber: "TS-1024" });
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        await waitFor(() => expect(trigger).toHaveFocus());
    },
};

/**
 * Pass `open` and update it in `onOpenChange` to open the dialog from your application, for example from a
 * menu item or when a session is about to expire. Without a `trigger`, focus returns to the element that had
 * it before the dialog opened.
 */
export const Controlled: Story = {
    decorators: [inColumn],
    args: {
        trigger: undefined,
        title: "Your session is about to expire",
        description: "You'll be signed out in 2 minutes. Unsaved changes will be lost.",
    },
    render: function ControlledDialog(args) {
        const [open, setOpen] = useState(false);
        const [answer, setAnswer] = useState("No answer yet");

        return (
            <>
                <Button variant="secondary" onClick={() => setOpen(true)}>
                    Simulate expiring session
                </Button>
                <p className={styles.status}>{answer}</p>
                <Dialog
                    {...args}
                    open={open}
                    onOpenChange={setOpen}
                    actions={
                        <>
                            <DialogClose>
                                <Button variant="secondary" onClick={() => setAnswer("Signed out")}>
                                    Sign out
                                </Button>
                            </DialogClose>
                            <DialogClose>
                                <Button onClick={() => setAnswer("Stayed signed in")}>Stay signed in</Button>
                            </DialogClose>
                        </>
                    }
                />
            </>
        );
    },
    play: async ({ canvas, userEvent }) => {
        const opener = canvas.getByRole("button", { name: "Simulate expiring session" });

        await userEvent.click(opener);
        const dialog = await screen.findByRole("dialog", { name: "Your session is about to expire" });
        await userEvent.click(within(dialog).getByRole("button", { name: "Stay signed in" }));
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        await expect(canvas.getByText("Stayed signed in")).toBeVisible();
        await waitFor(() => expect(opener).toHaveFocus());
    },
};

/**
 * An icon button as the trigger, with a tooltip that shows its name, as in a table row or a toolbar. Pass the
 * `Tooltip`, with the icon button inside it, as `trigger`: the tooltip passes the dialog's props on to the
 * button. A `Tooltip` around the `Dialog` doesn't work, because the dialog passes the props it doesn't handle to
 * its popup.
 */
export const IconButtonTrigger: Story = {
    args: {
        title: "Delete variant?",
        description: "This permanently deletes the variant “Summer T-shirt, blue, M”. You can't undo this.",
        size: "small",
    },
    render: (args) => (
        <Dialog
            {...args}
            trigger={
                <Tooltip content="Delete variant">
                    <IconButton label="Delete variant">
                        <Icon name="delete" />
                    </IconButton>
                </Tooltip>
            }
            actions={
                <>
                    <DialogClose>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose>
                        <Button>Delete</Button>
                    </DialogClose>
                </>
            }
        />
    ),
    play: async ({ args, canvas, userEvent }) => {
        const trigger = canvas.getByRole("button", { name: "Delete variant" });
        await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

        await afterEffects();
        await userEvent.hover(trigger);
        const tooltip = await screen.findByText("Delete variant", { selector: ".dextinityTooltip" }, { timeout: 2000 });
        await waitFor(() => expect(tooltip).toBeVisible());

        await userEvent.click(trigger);
        const dialog = await screen.findByRole("dialog", { name: "Delete variant?" });
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());
        await waitFor(() => expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus());
        await waitFor(() => expect(screen.queryByText("Delete variant", { selector: ".dextinityTooltip" })).not.toBeInTheDocument());

        await userEvent.click(within(dialog).getByRole("button", { name: "Delete" }));
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
        await waitFor(() => expect(trigger).toHaveFocus());
    },
};

const termsSections = [
    { id: "scope", text: "These terms apply to all orders placed in the online shop by consumers and businesses." },
    { id: "contract", text: "Your order is an offer to buy. The contract is concluded when we confirm the order by email." },
    { id: "prices", text: "All prices include VAT. Shipping costs are shown in the cart before you place the order." },
    { id: "payment", text: "You can pay by credit card, PayPal or invoice. Invoices are due within 14 days." },
    { id: "delivery", text: "We deliver to Austria, Germany and Switzerland. Delivery times are shown on each product." },
    { id: "withdrawal", text: "Consumers can withdraw from the contract within 14 days without giving a reason." },
    { id: "returns", text: "Return the goods within 14 days of the withdrawal. We refund the price within 14 days." },
    { id: "warranty", text: "The statutory warranty applies. Report defects within two years of delivery." },
    { id: "liability", text: "We are liable for intent and gross negligence, and for injury to life, body or health." },
    { id: "privacy", text: "We process your data to fulfil the contract. Read the privacy policy for details." },
    { id: "disputes", text: "The law of Austria applies. The place of jurisdiction for businesses is Vienna." },
    { id: "changes", text: "We may change these terms for future orders. The terms at the time of the order apply." },
];

/**
 * Content taller than the window scrolls inside the dialog, between lines that separate it from the title and
 * the actions, which stay visible. The scrolling content can receive focus, so keyboard users can scroll it
 * with the arrow keys.
 */
export const LongContent: Story = {
    args: {
        trigger: <Button variant="secondary">Read the terms of service</Button>,
        title: "Terms of service",
        description: "Last updated on 1 October 2026.",
    },
    render: (args) => (
        <Dialog
            {...args}
            actions={
                <>
                    <DialogClose>
                        <Button variant="secondary">Decline</Button>
                    </DialogClose>
                    <DialogClose>
                        <Button>Accept</Button>
                    </DialogClose>
                </>
            }
        >
            <div className={styles.stack}>
                {termsSections.map((section) => (
                    <Typography key={section.id}>{section.text}</Typography>
                ))}
            </div>
        </Dialog>
    ),
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Read the terms of service" }));
        const dialog = await screen.findByRole("dialog", { name: "Terms of service" });
        const body = within(dialog).getByText(termsSections[0].text).closest(".dextinityDialog__body");

        await waitFor(() => expect(body).toHaveAttribute("data-scrollable"));
        await expect(body).toHaveAttribute("tabindex", "0");
        await waitFor(() => expect(within(dialog).getByRole("button", { name: "Accept" })).toBeVisible());
    },
};

/**
 * The dialog renders at the end of the page, outside the `ThemeSwitch` around its trigger, and still takes its
 * theme and color scheme, so it looks like the part of the page it opened from. The backdrop and the viewport
 * carry the theme.
 */
export const InsideAThemeSwitch: Story = {
    args: {
        closeLabel: "Close",
    },
    render: (args) => (
        <ThemeSwitch theme="dextinity" colorScheme="dark" className={styles.themeSwitch}>
            <Dialog {...args}>
                Orders placed before 2 pm ship the same working day. Delivery takes one to two working days within Austria and Germany.
            </Dialog>
        </ThemeSwitch>
    ),
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Show shipping details" }));
        const dialog = await screen.findByRole("dialog", { name: "Shipping details" });
        const viewport = dialog.closest(".dextinityDialog__viewport");
        const backdrop = document.body.querySelector(".dextinityDialog__backdrop");

        for (const themedElement of [viewport, backdrop]) {
            await expect(themedElement).toHaveAttribute("data-dextinity-theme", "dextinity");
            await expect(themedElement).toHaveAttribute("data-dextinity-color-scheme", "dark");
        }
        await expect(
            getComputedStyle(viewport as Element)
                .getPropertyValue("--dextinity-color-surface")
                .trim(),
        ).toBe("#141517");
    },
};

/**
 * `className` and `style` adjust the popup, `slotProps` its parts. Both are added to the component's own classes.
 * Here, the popup's class gives it a width between the `small` and the `medium` size, and the actions' class
 * moves the first action, "Delete", to the start, away from "Cancel" and "Save". See "Foundations/Customization"
 * for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        trigger: <Button variant="secondary">Edit product</Button>,
        title: "Edit product",
        closeLabel: "Close",
        className: styles.narrowDialog,
        slotProps: {
            actions: { className: styles.actionsWithStart },
        },
    },
    render: (args) => (
        <Dialog
            {...args}
            actions={
                <>
                    <DialogClose>
                        <Button variant="ghost">Delete</Button>
                    </DialogClose>
                    <DialogClose>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose>
                        <Button>Save</Button>
                    </DialogClose>
                </>
            }
        >
            <TextField label="Name" defaultValue="Summer T-shirt" />
        </Dialog>
    ),
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Edit product" }));
        const dialog = await screen.findByRole("dialog", { name: "Edit product" });

        await expect(dialog).toHaveClass("dextinityDialog", styles.narrowDialog);
        await expect(within(dialog).getByRole("button", { name: "Delete" }).parentElement).toHaveClass(
            "dextinityDialog__actions",
            styles.actionsWithStart,
        );
    },
};
