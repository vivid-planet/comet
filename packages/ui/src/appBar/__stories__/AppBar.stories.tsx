import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, waitFor } from "storybook/test";

import { Avatar } from "../../avatar/Avatar";
import { Icon } from "../../icon/Icon";
import { Menu } from "../../menu/Menu";
import { MenuItem } from "../../menu/MenuItem";
import { MenuLinkItem } from "../../menu/MenuLinkItem";
import { MenuSeparator } from "../../menu/MenuSeparator";
import { AppBar } from "../AppBar";
import { AppBarButton } from "../AppBarButton";
import { AppBarIconButton } from "../AppBarIconButton";
import { AppBarSpacer } from "../AppBarSpacer";
import styles from "./AppBar.stories.module.css";

const meta = {
    component: AppBar,
    subcomponents: { AppBarButton, AppBarIconButton, AppBarSpacer },
    title: "Components/AppBar",
    // The docs page is AppBar.mdx.
    tags: ["!autodocs"],
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        // The bar's content is JSX in the render functions, so that the documentation snippets show it as code.
        children: { control: false },
        className: { control: false },
        style: { control: false },
    },
} satisfies Meta<typeof AppBar>;

export default meta;

type Story = StoryObj<typeof meta>;

const openHelp = fn();
const toggleNavigation = fn();
const showNotifications = fn();
const logOut = fn();

/**
 * The product's name at the start and an application-wide action at the end, pushed there by `AppBarSpacer`.
 */
export const Default: Story = {
    render: (args) => (
        <AppBar {...args}>
            <span className={styles.productName}>Dextinity</span>
            <AppBarSpacer />
            <AppBarButton startIcon={<Icon name="help" />} onClick={openHelp}>
                Help
            </AppBarButton>
        </AppBar>
    ),
    play: async ({ canvas, userEvent }) => {
        openHelp.mockClear();
        await expect(canvas.getByRole("banner")).toHaveTextContent("Dextinity");

        await userEvent.click(canvas.getByRole("button", { name: "Help" }));
        await expect(openHelp).toHaveBeenCalledOnce();

        await userEvent.keyboard("{Enter}");
        await expect(openHelp).toHaveBeenCalledTimes(2);
    },
};

/**
 * The bar of an application: the menu button opens the navigation, here a `Menu` of links, next to the product's
 * name. The end holds the help, the notifications and the user menu, which opens with `align="end"` so it stays on
 * the page. An application with a navigation drawer toggles the drawer with the menu button instead.
 */
export const ApplicationBar: Story = {
    render: (args) => (
        <AppBar {...args}>
            <Menu
                trigger={
                    <AppBarIconButton label="Open navigation">
                        <Icon name="menu" />
                    </AppBarIconButton>
                }
            >
                <MenuLinkItem href="#dashboard" icon={<Icon name="dashboard" />}>
                    Dashboard
                </MenuLinkItem>
                <MenuLinkItem href="#pages" icon={<Icon name="pages" />}>
                    Pages
                </MenuLinkItem>
                <MenuLinkItem href="#products" icon={<Icon name="products" />}>
                    Products
                </MenuLinkItem>
                <MenuLinkItem href="#orders" icon={<Icon name="orders" />}>
                    Orders
                </MenuLinkItem>
            </Menu>
            <span className={styles.productName}>Dextinity</span>
            <AppBarSpacer />
            <AppBarButton startIcon={<Icon name="help" />} onClick={openHelp}>
                Help
            </AppBarButton>
            <AppBarIconButton label="Notifications" onClick={showNotifications}>
                <Icon name="bell" />
            </AppBarIconButton>
            <Menu
                align="end"
                trigger={
                    <AppBarButton startIcon={<Avatar name="Jane Doe" size="small" />} endIcon={<Icon name="chevron-down" />}>
                        Jane Doe
                    </AppBarButton>
                }
            >
                <MenuLinkItem href="#profile" icon={<Icon name="user" />}>
                    Profile
                </MenuLinkItem>
                <MenuLinkItem href="#settings" icon={<Icon name="settings" />}>
                    Settings
                </MenuLinkItem>
                <MenuSeparator />
                <MenuItem icon={<Icon name="logout" />} onClick={logOut}>
                    Log out
                </MenuItem>
            </Menu>
        </AppBar>
    ),
    play: async ({ canvas, userEvent }) => {
        logOut.mockClear();
        showNotifications.mockClear();

        const navigationButton = canvas.getByRole("button", { name: "Open navigation" });
        await userEvent.click(navigationButton);
        const navigation = await screen.findByRole("menu", { name: "Open navigation" });
        await expect(navigationButton).toHaveAttribute("data-popup-open");
        await expect(screen.getByRole("menuitem", { name: "Products" })).toHaveAttribute("href", "#products");
        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(navigation).not.toBeInTheDocument());
        await waitFor(() => expect(navigationButton).toHaveFocus());

        await userEvent.click(canvas.getByRole("button", { name: "Notifications" }));
        await expect(showNotifications).toHaveBeenCalledOnce();

        const userButton = canvas.getByRole("button", { name: "Jane Doe" });
        await userEvent.click(userButton);
        const userMenu = await screen.findByRole("menu", { name: "Jane Doe" });
        await waitFor(() => expect(Math.round(userMenu.getBoundingClientRect().right)).toBe(Math.round(userButton.getBoundingClientRect().right)));
        await userEvent.click(screen.getByRole("menuitem", { name: "Log out" }));
        await expect(logOut).toHaveBeenCalledOnce();
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    },
};

/**
 * An icon button saves room for an action with a widely understood icon. `label` names it for screen readers,
 * which announce it in place of the icon.
 */
export const WithIconButtons: Story = {
    render: (args) => (
        <AppBar {...args}>
            <AppBarIconButton label="Open navigation" onClick={toggleNavigation}>
                <Icon name="menu" />
            </AppBarIconButton>
            <span className={styles.productName}>Dextinity</span>
            <AppBarSpacer />
            <AppBarIconButton label="Help" onClick={openHelp}>
                <Icon name="help" />
            </AppBarIconButton>
            <AppBarIconButton label="Notifications" onClick={showNotifications}>
                <Icon name="bell" />
            </AppBarIconButton>
        </AppBar>
    ),
    play: async ({ canvas, userEvent }) => {
        toggleNavigation.mockClear();
        showNotifications.mockClear();

        await userEvent.tab();
        await expect(canvas.getByRole("button", { name: "Open navigation" })).toHaveFocus();
        await userEvent.keyboard("{Enter}");
        await expect(toggleNavigation).toHaveBeenCalledOnce();

        await userEvent.tab();
        await userEvent.tab();
        await expect(canvas.getByRole("button", { name: "Notifications" })).toHaveFocus();
        await userEvent.keyboard(" ");
        await expect(showNotifications).toHaveBeenCalledOnce();
    },
};

/**
 * A disabled button doesn't react to clicks. Prefer explaining why an action isn't available over only
 * disabling it.
 */
export const Disabled: Story = {
    render: (args) => (
        <AppBar {...args}>
            <span className={styles.productName}>Dextinity</span>
            <AppBarSpacer />
            <AppBarButton startIcon={<Icon name="help" />} onClick={openHelp} disabled>
                Help
            </AppBarButton>
        </AppBar>
    ),
    play: async ({ canvas, userEvent }) => {
        openHelp.mockClear();

        await userEvent.click(canvas.getByRole("button", { name: "Help" }));
        await expect(openHelp).not.toHaveBeenCalled();
    },
};

/**
 * `className` styles the bar itself, `slotProps` the inner parts of its buttons. Both are added to the
 * components' own classes. Here, a line in the primary color runs along the bar's bottom edge, and the chevron
 * of the user menu's button turns over while the menu is open. See "Foundations/Customization" for all ways to
 * adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        className: styles.accentLine,
    },
    render: (args) => (
        <AppBar {...args}>
            <span className={styles.productName}>Dextinity</span>
            <AppBarSpacer />
            <Menu
                align="end"
                trigger={
                    <AppBarButton endIcon={<Icon name="chevron-down" />} slotProps={{ endIcon: { className: styles.turningChevron } }}>
                        Jane Doe
                    </AppBarButton>
                }
            >
                <MenuLinkItem href="#profile" icon={<Icon name="user" />}>
                    Profile
                </MenuLinkItem>
                <MenuItem icon={<Icon name="logout" />} onClick={logOut}>
                    Log out
                </MenuItem>
            </Menu>
        </AppBar>
    ),
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByRole("banner")).toHaveClass("dextinityAppBar", styles.accentLine);

        const userButton = canvas.getByRole("button", { name: "Jane Doe" });
        await expect(userButton.querySelector(".dextinityAppBarButton__endIcon")).toHaveClass(styles.turningChevron);
        await userEvent.click(userButton);
        await screen.findByRole("menu", { name: "Jane Doe" });
        await expect(userButton).toHaveAttribute("data-popup-open");
        await userEvent.keyboard("{Escape}");
        await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    },
};
