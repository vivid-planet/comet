import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, screen, waitFor } from "storybook/test";

import { Button } from "../../button/Button";
import { Icon } from "../../icon/Icon";
import { IconButton } from "../../iconButton/IconButton";
import { ThemeSwitch } from "../../themeSwitch/ThemeSwitch";
import { Menu } from "../Menu";
import { MenuGroup } from "../MenuGroup";
import { MenuItem } from "../MenuItem";
import { MenuLinkItem } from "../MenuLinkItem";
import { MenuSeparator } from "../MenuSeparator";
import styles from "./Menu.stories.module.css";

const triggerOptions = {
    Button: <Button variant="secondary">Actions</Button>,
    IconButton: (
        <IconButton label="More actions">
            <Icon name="more" />
        </IconButton>
    ),
};

const meta = {
    component: Menu,
    subcomponents: { MenuItem, MenuLinkItem, MenuGroup, MenuSeparator },
    title: "Components/Menu",
    // The docs page is Menu.mdx.
    tags: ["!autodocs"],
    args: {
        trigger: <Button variant="secondary">Actions</Button>,
        onOpenChange: fn(),
    },
    argTypes: {
        trigger: { control: "select", options: Object.keys(triggerOptions), mapping: triggerOptions },
        side: { control: "select", options: ["bottom", "top", "inline-start", "inline-end"] },
        align: { control: "radio", options: ["start", "center", "end"] },
        // The items are JSX in the render functions, so that the documentation snippets show them as code.
        children: { control: false },
        className: { control: false },
        style: { control: false },
        slotProps: { control: false },
        actionsRef: { control: false },
    },
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

const atRowEnd: Decorator = (Story) => (
    <div className={styles.rowEnd}>
        <Story />
    </div>
);

const editProduct = fn();
const duplicateProduct = fn();
const deleteProduct = fn();

/**
 * A few actions behind a button. Clicking the trigger opens the menu, clicking an item runs its `onClick` and
 * closes the menu, and focus returns to the trigger.
 */
export const Default: Story = {
    render: (args) => (
        <Menu {...args}>
            <MenuItem onClick={editProduct}>Edit</MenuItem>
            <MenuItem onClick={duplicateProduct}>Duplicate</MenuItem>
            <MenuItem>Archive</MenuItem>
        </Menu>
    ),
    play: async ({ args, canvas, userEvent }) => {
        editProduct.mockClear();
        duplicateProduct.mockClear();
        const trigger = canvas.getByRole("button", { name: "Actions" });
        await expect(trigger).toHaveAttribute("aria-haspopup", "menu");

        await userEvent.click(trigger);
        const menu = await screen.findByRole("menu", { name: "Actions" });
        await waitFor(() => expect(menu).toBeVisible());
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(true, expect.anything());
        await expect(screen.getAllByRole("menuitem").map((item) => item.textContent)).toEqual(["Edit", "Duplicate", "Archive"]);

        await userEvent.click(screen.getByRole("menuitem", { name: "Duplicate" }));
        await expect(duplicateProduct).toHaveBeenCalledOnce();
        await expect(editProduct).not.toHaveBeenCalled();
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
        await waitFor(() => expect(trigger).toHaveFocus());
    },
};

/**
 * An icon button opens the actions of a row, for example in a table. Icons help to find an action quickly; give
 * all items an icon or none. Put destructive actions last, after a separator, in the `danger` tone.
 *
 * With the keyboard, Enter, Space or the arrow down key opens the menu and highlights the first item, the arrow
 * keys move through the items, Enter activates one and Escape closes the menu.
 */
export const WithIconsAndDangerTone: Story = {
    args: {
        trigger: (
            <IconButton label="More actions">
                <Icon name="more" />
            </IconButton>
        ),
    },
    render: (args) => (
        <Menu {...args}>
            <MenuItem icon={<Icon name="edit" />} onClick={editProduct}>
                Edit
            </MenuItem>
            <MenuItem icon={<Icon name="copy" />} onClick={duplicateProduct}>
                Duplicate
            </MenuItem>
            <MenuItem icon={<Icon name="download" />}>Download</MenuItem>
            <MenuSeparator />
            <MenuItem icon={<Icon name="delete" />} tone="danger" onClick={deleteProduct}>
                Delete
            </MenuItem>
        </Menu>
    ),
    play: async ({ args, canvas, userEvent }) => {
        duplicateProduct.mockClear();
        deleteProduct.mockClear();
        const trigger = canvas.getByRole("button", { name: "More actions" });

        await userEvent.tab();
        await expect(trigger).toHaveFocus();
        await userEvent.keyboard("{Enter}");
        const menu = await screen.findByRole("menu", { name: "More actions" });
        await waitFor(() => expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus());
        await expect(screen.getByRole("separator")).toBeInTheDocument();

        await userEvent.keyboard("{ArrowUp}");
        const deleteItem = screen.getByRole("menuitem", { name: "Delete" });
        await waitFor(() => expect(deleteItem).toHaveFocus());
        await expect(deleteItem).toHaveAttribute("data-tone", "danger");

        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(menu).not.toBeInTheDocument());
        await waitFor(() => expect(trigger).toHaveFocus());
        await expect(deleteProduct).not.toHaveBeenCalled();

        await userEvent.keyboard("{ArrowDown}");
        await waitFor(() => expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus());
        await userEvent.keyboard("{ArrowDown}{Enter}");
        await expect(duplicateProduct).toHaveBeenCalled();
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
        await expect(args.onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    },
};

/**
 * `MenuLinkItem` navigates: it is a link, so the browser can also open it in a new tab. For a router's link,
 * pass the router's link component as `render`. Actions in the same menu stay `MenuItem`s, like "Log out" here.
 */
export const WithLinks: Story = {
    args: {
        trigger: <Button variant="secondary">Account</Button>,
        align: "end",
    },
    decorators: [atRowEnd],
    render: (args) => (
        <Menu {...args}>
            <MenuLinkItem href="#profile" icon={<Icon name="user" />}>
                Profile
            </MenuLinkItem>
            <MenuLinkItem href="#settings" icon={<Icon name="settings" />}>
                Settings
            </MenuLinkItem>
            <MenuSeparator />
            <MenuItem icon={<Icon name="logout" />}>Log out</MenuItem>
        </Menu>
    ),
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Account" }));
        const profile = await screen.findByRole("menuitem", { name: "Profile" });
        await expect(profile).toHaveAttribute("href", "#profile");

        await expect(screen.getByRole("menuitem", { name: "Settings" })).toHaveAttribute("href", "#settings");
        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    },
};

/**
 * A group's label names its items, for example the formats under "Export as". The arrow keys skip the labels.
 */
export const WithGroups: Story = {
    args: {
        trigger: <Button variant="secondary">Export</Button>,
    },
    render: (args) => (
        <Menu {...args}>
            <MenuGroup label="Export as">
                <MenuItem>PDF</MenuItem>
                <MenuItem>CSV</MenuItem>
                <MenuItem>Excel</MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup label="Share">
                <MenuItem>Copy link</MenuItem>
                <MenuItem>Send by email</MenuItem>
            </MenuGroup>
        </Menu>
    ),
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Export" }));

        await expect(await screen.findByRole("group", { name: "Export as" })).toContainElement(screen.getByRole("menuitem", { name: "CSV" }));
        await expect(screen.getByRole("group", { name: "Share" })).toContainElement(screen.getByRole("menuitem", { name: "Copy link" }));

        await userEvent.keyboard("{ArrowDown}");
        await waitFor(() => expect(screen.getByRole("menuitem", { name: "PDF" })).toHaveFocus());
        await userEvent.keyboard("{ArrowUp}");
        await waitFor(() => expect(screen.getByRole("menuitem", { name: "Send by email" })).toHaveFocus());
        await userEvent.keyboard(" ");
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    },
};

/**
 * An item that doesn't apply right now is disabled: it stays in place, but clicking it does nothing. Leave out
 * an item that never applies instead.
 */
export const WithDisabledItem: Story = {
    render: (args) => (
        <Menu {...args}>
            <MenuItem onClick={editProduct}>Edit</MenuItem>
            <MenuItem onClick={duplicateProduct} disabled>
                Duplicate
            </MenuItem>
            <MenuItem>Archive</MenuItem>
        </Menu>
    ),
    play: async ({ canvas, userEvent }) => {
        duplicateProduct.mockClear();
        await userEvent.click(canvas.getByRole("button", { name: "Actions" }));

        const duplicate = await screen.findByRole("menuitem", { name: "Duplicate" });
        await expect(duplicate).toHaveAttribute("aria-disabled", "true");
        await userEvent.click(duplicate);
        await expect(duplicateProduct).not.toHaveBeenCalled();
        await expect(screen.getByRole("menu")).toBeInTheDocument();

        await userEvent.hover(screen.getByRole("menuitem", { name: "Edit" }));
        await userEvent.keyboard("{ArrowDown}");
        await waitFor(() => expect(duplicate).toHaveFocus());
        await userEvent.keyboard("{Enter}");
        await expect(duplicateProduct).not.toHaveBeenCalled();
        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    },
};

/**
 * `side` and `align` set where the menu opens. A trigger at the end of a bar opens its menu with `align="end"`,
 * so the menu stays on the page. Where there's no room, the menu opens on the other side.
 */
export const Alignment: Story = {
    args: {
        trigger: (
            <IconButton label="More actions">
                <Icon name="more" />
            </IconButton>
        ),
        align: "end",
    },
    decorators: [atRowEnd],
    render: (args) => (
        <Menu {...args}>
            <MenuItem icon={<Icon name="edit" />}>Edit</MenuItem>
            <MenuItem icon={<Icon name="copy" />}>Duplicate</MenuItem>
        </Menu>
    ),
    play: async ({ canvas, userEvent }) => {
        const trigger = canvas.getByRole("button", { name: "More actions" });
        await userEvent.click(trigger);

        const menu = await screen.findByRole("menu");
        await waitFor(() => expect(menu).toHaveAttribute("data-align", "end"));
        await waitFor(() => expect(Math.round(menu.getBoundingClientRect().right)).toBe(Math.round(trigger.getBoundingClientRect().right)));
        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    },
};

/**
 * Pass `open` and update it in `onOpenChange` when the application needs to know or set whether the menu is
 * open, for example to load the items when it opens.
 */
export const Controlled: Story = {
    render: function ControlledMenu(args) {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className={styles.row}>
                <Menu {...args} open={isOpen} onOpenChange={setIsOpen}>
                    <MenuItem>Edit</MenuItem>
                    <MenuItem>Duplicate</MenuItem>
                </Menu>
                <span className={styles.output}>{isOpen ? "The menu is open." : "The menu is closed."}</span>
            </div>
        );
    },
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByText("The menu is closed.")).toBeInTheDocument();

        await userEvent.click(canvas.getByRole("button", { name: "Actions" }));
        await screen.findByRole("menu");
        await expect(canvas.getByText("The menu is open.")).toBeInTheDocument();

        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
        await expect(canvas.getByText("The menu is closed.")).toBeInTheDocument();
    },
};

/**
 * A disabled menu can't be opened. Prefer explaining why the actions aren't available over only disabling them.
 */
export const Disabled: Story = {
    args: {
        disabled: true,
    },
    render: (args) => (
        <Menu {...args}>
            <MenuItem>Edit</MenuItem>
        </Menu>
    ),
    play: async ({ args, canvas, userEvent }) => {
        const trigger = canvas.getByRole("button", { name: "Actions" });
        await expect(trigger).toHaveAttribute("data-disabled");

        await userEvent.click(trigger);
        await expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        await expect(args.onOpenChange).not.toHaveBeenCalled();
    },
};

/**
 * The menu renders at the end of the page, outside the `ThemeSwitch` around its trigger, and still takes its
 * theme and color scheme, so it looks like the part of the page its trigger is in.
 */
export const InsideAThemeSwitch: Story = {
    render: (args) => (
        <ThemeSwitch theme="dextinity" colorScheme="dark" className={styles.themeSwitch}>
            <Menu {...args}>
                <MenuItem icon={<Icon name="edit" />}>Edit</MenuItem>
                <MenuItem icon={<Icon name="copy" />}>Duplicate</MenuItem>
                <MenuSeparator />
                <MenuItem icon={<Icon name="delete" />} tone="danger">
                    Delete
                </MenuItem>
            </Menu>
        </ThemeSwitch>
    ),
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("button", { name: "Actions" }));
        const menu = await screen.findByRole("menu", { name: "Actions" });
        await waitFor(() => expect(menu).toBeVisible());
        const positioner = menu.closest(".dextinityMenu__positioner");

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
 * `className` styles the popup, `slotProps` its inner parts: here the positioner, which opens the menu further
 * from the trigger, and the icon of an item. Both are added to the component's own classes. See
 * "Foundations/Customization" for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        className: styles.widePopup,
        slotProps: {
            positioner: { sideOffset: 8 },
        },
    },
    render: (args) => (
        <Menu {...args}>
            <MenuItem icon={<Icon name="edit" />}>Edit</MenuItem>
            <MenuItem icon={<Icon name="star" />} slotProps={{ icon: { className: styles.accentIcon } }}>
                Add to favorites
            </MenuItem>
        </Menu>
    ),
    play: async ({ canvas, userEvent }) => {
        const trigger = canvas.getByRole("button", { name: "Actions" });
        await userEvent.click(trigger);
        const menu = await screen.findByRole("menu", { name: "Actions" });

        await expect(menu).toHaveClass("dextinityMenu", styles.widePopup);
        await expect(screen.getByRole("menuitem", { name: "Add to favorites" }).querySelector(".dextinityMenuItem__icon")).toHaveClass(
            styles.accentIcon,
        );
        await waitFor(() => expect(Math.round(menu.getBoundingClientRect().top - trigger.getBoundingClientRect().bottom)).toBe(8));
        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    },
};
