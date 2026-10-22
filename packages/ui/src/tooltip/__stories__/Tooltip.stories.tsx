import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import { afterEffects } from "#storybook/afterEffects";

import { Button } from "../../button/Button";
import { Icon } from "../../icon/Icon";
import { IconButton } from "../../iconButton/IconButton";
import { ThemeSwitch } from "../../themeSwitch/ThemeSwitch";
import { Tooltip } from "../Tooltip";
import { TooltipProvider } from "../TooltipProvider";
import styles from "./Tooltip.stories.module.css";

const meta = {
    component: Tooltip,
    subcomponents: { TooltipProvider },
    title: "Components/Tooltip",
    // The docs page is Tooltip.mdx.
    tags: ["!autodocs"],
    args: {
        content: "Edit product",
        children: (
            <IconButton label="Edit product">
                <Icon name="edit" />
            </IconButton>
        ),
        onOpenChange: fn(),
    },
    argTypes: {
        content: { control: "text" },
        side: { control: "select", options: ["top", "bottom", "inline-start", "inline-end"] },
        delay: { control: "number" },
        // The trigger is JSX in the render functions, so that the documentation snippets show it as code.
        children: { control: false },
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
        ref: { control: false },
        actionsRef: { control: false },
    },
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

const inRow: Decorator = (Story) => (
    <div className={styles.row}>
        <Story />
    </div>
);

const withRoom: Decorator = (Story) => (
    <div className={styles.withRoom}>
        <Story />
    </div>
);

/** Waits for the tooltip with this text to finish its opening transition. */
async function findOpenTooltip(text: string, timeout = 2000) {
    const tooltip = await screen.findByText(text, {}, { timeout });
    await waitFor(() => expect(tooltip).toBeVisible());
    return tooltip;
}

/**
 * An icon button's label, shown to sighted users. The icon button already has the same text as its accessible
 * name, so screen readers announce it without the tooltip. The tooltip opens when the pointer rests on the
 * button and right away when the button receives keyboard focus; Escape closes it.
 */
export const Default: Story = {
    decorators: [withRoom],
    render: (args) => (
        <Tooltip {...args}>
            <IconButton label="Edit product">
                <Icon name="edit" />
            </IconButton>
        </Tooltip>
    ),
    play: async ({ args, canvas, userEvent }) => {
        await afterEffects();
        const button = canvas.getByRole("button", { name: "Edit product" });

        await userEvent.hover(button);
        await findOpenTooltip("Edit product");
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());

        await userEvent.unhover(button);
        await waitFor(() => expect(screen.queryByText("Edit product")).not.toBeInTheDocument());
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());

        await userEvent.tab();
        await expect(button).toHaveFocus();
        await findOpenTooltip("Edit product", 300);

        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByText("Edit product")).not.toBeInTheDocument());
        await expect(button).toHaveFocus();
    },
};

/**
 * A button with text needs no tooltip for its name. A tooltip can still show its keyboard shortcut, which is
 * helpful but not needed to use the button.
 */
export const WithButton: Story = {
    decorators: [withRoom],
    args: {
        content: "Save changes (Ctrl+S)",
    },
    render: (args) => (
        <Tooltip {...args}>
            <Button>Save changes</Button>
        </Tooltip>
    ),
    play: async ({ canvas, userEvent }) => {
        await afterEffects();
        await userEvent.hover(canvas.getByRole("button", { name: "Save changes" }));
        await findOpenTooltip("Save changes (Ctrl+S)");

        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByText("Save changes (Ctrl+S)")).not.toBeInTheDocument());
    },
};

/**
 * In a group of icon buttons, such as a toolbar, wrap the tooltips in a `TooltipProvider`. Once the first
 * tooltip has opened, moving the pointer to the next button opens its tooltip right away.
 */
export const InToolbar: Story = {
    decorators: [withRoom, inRow],
    render: (args) => (
        <TooltipProvider>
            <Tooltip {...args} content="Edit product">
                <IconButton label="Edit product">
                    <Icon name="edit" />
                </IconButton>
            </Tooltip>
            <Tooltip {...args} content="Duplicate product">
                <IconButton label="Duplicate product">
                    <Icon name="copy" />
                </IconButton>
            </Tooltip>
            <Tooltip {...args} content="Delete product">
                <IconButton label="Delete product">
                    <Icon name="delete" />
                </IconButton>
            </Tooltip>
        </TooltipProvider>
    ),
    play: async ({ canvas, userEvent }) => {
        await afterEffects();
        await userEvent.hover(canvas.getByRole("button", { name: "Edit product" }));
        await findOpenTooltip("Edit product");

        await userEvent.hover(canvas.getByRole("button", { name: "Duplicate product" }));
        // Well below the delay of 600 ms that the first tooltip waited for.
        await findOpenTooltip("Duplicate product", 300);
        await waitFor(() => expect(screen.queryByText("Edit product")).not.toBeInTheDocument());
    },
};

/**
 * `side` picks the side of the trigger the tooltip opens on; choose the one that keeps it clear of what the
 * user looks at next. It opens on the opposite side when there's no room. `showArrow` points the tooltip at
 * its trigger, which helps where several triggers are close together.
 */
export const WithArrow: Story = {
    decorators: [withRoom],
    args: {
        content: "Product settings",
        side: "inline-end",
        showArrow: true,
    },
    render: (args) => (
        <Tooltip {...args}>
            <IconButton label="Product settings">
                <Icon name="settings" />
            </IconButton>
        </Tooltip>
    ),
    play: async ({ canvas, userEvent }) => {
        await afterEffects();
        await userEvent.hover(canvas.getByRole("button", { name: "Product settings" }));
        const tooltip = await findOpenTooltip("Product settings");

        await expect(tooltip).toHaveAttribute("data-side", "inline-end");
        await expect(tooltip.querySelector(".dextinityTooltip__arrow")).toBeInTheDocument();
    },
};

/**
 * `disabled` turns the tooltip off while the trigger stays usable, for example while a shortened text is shown
 * in full and needs no tooltip.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
        delay: 0,
    },
    render: (args) => (
        <Tooltip {...args}>
            <IconButton label="Edit product">
                <Icon name="edit" />
            </IconButton>
        </Tooltip>
    ),
    play: async ({ args, canvas, userEvent }) => {
        await afterEffects();
        const button = canvas.getByRole("button", { name: "Edit product" });

        await userEvent.hover(button);
        await userEvent.tab();
        await expect(button).toHaveFocus();
        await new Promise((resolve) => setTimeout(resolve, 200));
        await expect(screen.queryByText("Edit product")).not.toBeInTheDocument();
        await expect(args.onOpenChange).not.toHaveBeenCalled();
    },
};

/**
 * A disabled button keeps its tooltip on hover, so a disabled icon button stays named for sighted users. With
 * `focusableWhenDisabled`, keyboard users reach the button and its tooltip too. Don't use the tooltip to explain
 * why the button is disabled: touch and screen reader users don't get it.
 */
export const OnADisabledButton: Story = {
    decorators: [withRoom],
    args: {
        content: "Delete product",
    },
    render: (args) => (
        <Tooltip {...args}>
            <IconButton label="Delete product" disabled focusableWhenDisabled>
                <Icon name="delete" />
            </IconButton>
        </Tooltip>
    ),
    play: async ({ canvas, userEvent }) => {
        await afterEffects();
        const button = canvas.getByRole("button", { name: "Delete product" });
        await expect(button).toHaveAttribute("aria-disabled", "true");

        await userEvent.hover(button);
        await findOpenTooltip("Delete product");

        await userEvent.unhover(button);
        await waitFor(() => expect(screen.queryByText("Delete product")).not.toBeInTheDocument());

        await userEvent.tab();
        await expect(button).toHaveFocus();
        await findOpenTooltip("Delete product", 300);
    },
};

/**
 * The tooltip renders at the end of the page, outside the `ThemeSwitch` around its trigger, and still takes its
 * theme and color scheme, so it looks like the part of the page its trigger is in.
 */
export const InsideAThemeSwitch: Story = {
    render: (args) => (
        <ThemeSwitch theme="dextinity" colorScheme="dark" className={styles.themeSwitch}>
            <Tooltip {...args}>
                <IconButton label="Edit product">
                    <Icon name="edit" />
                </IconButton>
            </Tooltip>
        </ThemeSwitch>
    ),
    play: async ({ canvas, userEvent }) => {
        await afterEffects();
        await userEvent.hover(canvas.getByRole("button", { name: "Edit product" }));
        const positioner = (await findOpenTooltip("Edit product")).closest(".dextinityTooltip__positioner");

        await expect(positioner).toHaveAttribute("data-dextinity-theme", "dextinity");
        await expect(positioner).toHaveAttribute("data-dextinity-color-scheme", "dark");
        await expect(
            getComputedStyle(positioner as Element)
                .getPropertyValue("--dextinity-color-surface")
                .trim(),
        ).toBe("#141517");
    },
};

/**
 * `className` and `style` adjust the popup, `slotProps` the popup's other props, the positioner and the arrow.
 * Both are added to the component's own classes. Here, the popup's class colors the tooltip with the primary
 * color, and the positioner aligns it with the start of a wide button instead of its center. See
 * "Foundations/Customization" for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    decorators: [withRoom],
    args: {
        content: "Preview the shop (Ctrl+Shift+P)",
        side: "bottom",
        className: styles.accentTooltip,
        slotProps: {
            positioner: { align: "start" },
        },
    },
    render: (args) => (
        <Tooltip {...args}>
            <Button variant="secondary" className={styles.wideButton}>
                Preview the shop
            </Button>
        </Tooltip>
    ),
    play: async ({ canvas, userEvent }) => {
        await afterEffects();
        await userEvent.hover(canvas.getByRole("button", { name: "Preview the shop" }));
        const tooltip = await findOpenTooltip("Preview the shop (Ctrl+Shift+P)");

        await expect(tooltip).toHaveClass("dextinityTooltip", styles.accentTooltip);
        await expect(tooltip).toHaveAttribute("data-align", "start");
    },
};
