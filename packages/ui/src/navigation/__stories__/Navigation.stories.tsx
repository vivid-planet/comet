import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { type MouseEvent, useState } from "react";
import { expect, fn, waitFor } from "storybook/test";

import { Icon } from "../../icon/Icon";
import { Navigation } from "../Navigation";
import { NavigationGroup } from "../NavigationGroup";
import { NavigationItem } from "../NavigationItem";
import styles from "./Navigation.stories.module.css";

const inSidebar: Decorator = (Story) => (
    <div className={styles.sidebar}>
        <Story />
    </div>
);

const meta = {
    component: Navigation,
    subcomponents: { NavigationItem, NavigationGroup },
    title: "Components/Navigation",
    // The docs page is Navigation.mdx.
    tags: ["!autodocs"],
    decorators: [inSidebar],
    args: {
        label: "Main",
    },
    argTypes: {
        label: { control: "text" },
        // The entries are JSX in the render functions, so that the documentation snippets show them as code.
        children: { control: false },
        className: { control: false },
        slotProps: { control: false },
    },
    render: (args) => (
        <Navigation {...args}>
            <NavigationItem href="#dashboard" active>
                Dashboard
            </NavigationItem>
            <NavigationItem href="#pages">Pages</NavigationItem>
            <NavigationItem href="#products">Products</NavigationItem>
            <NavigationItem href="#orders">Orders</NavigationItem>
        </Navigation>
    ),
} satisfies Meta<typeof Navigation>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A link for each page of the application, named by `label` for screen readers. `active` marks the item of
 * the current page, which screen readers announce as the current page. Tab moves through the links in order.
 */
export const Default: Story = {
    play: async ({ canvas, userEvent }) => {
        const dashboard = canvas.getByRole("link", { name: "Dashboard" });
        const pages = canvas.getByRole("link", { name: "Pages" });

        await expect(canvas.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
        await expect(canvas.getAllByRole("listitem")).toHaveLength(4);
        await expect(dashboard).toHaveAttribute("aria-current", "page");
        await expect(dashboard).toHaveAttribute("href", "#dashboard");
        await expect(pages).not.toHaveAttribute("aria-current");

        await userEvent.tab();
        await expect(dashboard).toHaveFocus();
        await userEvent.tab();
        await expect(pages).toHaveFocus();
    },
};

/**
 * Icons help users find a page at a glance. Give either all items on the first level an icon or none, so their
 * texts line up. The icons are decorative: the text names the page.
 */
export const WithIcons: Story = {
    render: (args) => (
        <Navigation {...args}>
            <NavigationItem href="#dashboard" icon={<Icon name="dashboard" />} active>
                Dashboard
            </NavigationItem>
            <NavigationItem href="#pages" icon={<Icon name="pages" />}>
                Pages
            </NavigationItem>
            <NavigationItem href="#products" icon={<Icon name="products" />}>
                Products
            </NavigationItem>
            <NavigationItem href="#orders" icon={<Icon name="orders" />}>
                Orders
            </NavigationItem>
            <NavigationItem href="#users" icon={<Icon name="users" />}>
                Users
            </NavigationItem>
        </Navigation>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("link", { name: "Dashboard" })).toHaveAccessibleName("Dashboard");
        await expect(canvas.getByRole("link", { name: "Products" })).toHaveAccessibleName("Products");
    },
};

const handleCatalogOpenChange = fn();

/**
 * `NavigationGroup` gathers related pages under a label, so a long navigation stays short. Clicking the group,
 * or pressing Enter or Space while it has focus, opens or closes it, and `onOpenChange` receives the new state.
 * Its items are indented, so their text lines up with the label of a group that has an icon. Tab skips the items
 * of a closed group.
 */
export const WithGroups: Story = {
    render: (args) => (
        <Navigation {...args}>
            <NavigationItem href="#dashboard" icon={<Icon name="dashboard" />} active>
                Dashboard
            </NavigationItem>
            <NavigationGroup label="Catalog" icon={<Icon name="products" />} onOpenChange={handleCatalogOpenChange}>
                <NavigationItem href="#products">Products</NavigationItem>
                <NavigationItem href="#categories">Categories</NavigationItem>
                <NavigationItem href="#attributes">Attributes</NavigationItem>
            </NavigationGroup>
            <NavigationItem href="#orders" icon={<Icon name="orders" />}>
                Orders
            </NavigationItem>
            <NavigationGroup label="Settings" icon={<Icon name="settings" />}>
                <NavigationItem href="#users">Users</NavigationItem>
                <NavigationItem href="#languages">Languages</NavigationItem>
            </NavigationGroup>
        </Navigation>
    ),
    play: async ({ canvas, userEvent }) => {
        handleCatalogOpenChange.mockClear();
        const catalog = canvas.getByRole("button", { name: "Catalog" });
        // The items of a closed group stay in the document, hidden, so that find in page finds them.
        const products = canvas.getByRole("link", { name: "Products", hidden: true });

        await expect(catalog).toHaveAttribute("aria-expanded", "false");
        await expect(products).not.toBeVisible();

        // The items of a closed group can't receive focus, so the browser's Tab skips them.
        products.focus();
        await expect(products).not.toHaveFocus();

        await userEvent.tab();
        await userEvent.tab();
        await expect(catalog).toHaveFocus();

        await userEvent.click(catalog);
        await expect(catalog).toHaveAttribute("aria-expanded", "true");
        await expect(handleCatalogOpenChange).toHaveBeenLastCalledWith(true, expect.anything());
        await waitFor(() => expect(products).toBeVisible());
        await userEvent.tab();
        await expect(products).toHaveFocus();

        await userEvent.tab({ shift: true });
        await userEvent.keyboard("{Enter}");
        await expect(catalog).toHaveAttribute("aria-expanded", "false");
        await expect(handleCatalogOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
        await waitFor(() => expect(products).not.toBeVisible());

        await userEvent.keyboard(" ");
        await expect(catalog).toHaveAttribute("aria-expanded", "true");
        await expect(handleCatalogOpenChange).toHaveBeenLastCalledWith(true, expect.anything());
        await expect(handleCatalogOpenChange).toHaveBeenCalledTimes(3);
        await waitFor(() => expect(products).toBeVisible());
    },
};

/**
 * A group opens by itself while it contains the active item, so the current page stays visible. The user can
 * still close it. On a server-rendered page, also set `defaultOpen` on that group, so that it is open in the
 * server's HTML.
 */
export const ActiveItemInGroup: Story = {
    render: (args) => (
        <Navigation {...args}>
            <NavigationItem href="#dashboard" icon={<Icon name="dashboard" />}>
                Dashboard
            </NavigationItem>
            <NavigationGroup label="Catalog" icon={<Icon name="products" />}>
                <NavigationItem href="#products">Products</NavigationItem>
                <NavigationItem href="#categories" active>
                    Categories
                </NavigationItem>
            </NavigationGroup>
            <NavigationItem href="#orders" icon={<Icon name="orders" />}>
                Orders
            </NavigationItem>
        </Navigation>
    ),
    play: async ({ canvas, userEvent }) => {
        const catalog = canvas.getByRole("button", { name: "Catalog" });
        const categories = canvas.getByRole("link", { name: "Categories" });

        await expect(catalog).toHaveAttribute("aria-expanded", "true");
        await expect(categories).toBeVisible();
        await expect(categories).toHaveAttribute("aria-current", "page");

        await userEvent.click(catalog);
        await expect(catalog).toHaveAttribute("aria-expanded", "false");
    },
};

/**
 * A group can contain further groups, for a navigation with many pages. Each level is indented further. Avoid
 * more than one further level: deep trees are hard to scan.
 */
export const NestedGroups: Story = {
    render: (args) => (
        <Navigation {...args}>
            <NavigationItem href="#dashboard" icon={<Icon name="dashboard" />}>
                Dashboard
            </NavigationItem>
            <NavigationGroup label="Catalog" icon={<Icon name="products" />}>
                <NavigationItem href="#products">Products</NavigationItem>
                <NavigationGroup label="Attributes">
                    <NavigationItem href="#colors" active>
                        Colors
                    </NavigationItem>
                    <NavigationItem href="#sizes">Sizes</NavigationItem>
                </NavigationGroup>
            </NavigationGroup>
            <NavigationItem href="#orders" icon={<Icon name="orders" />}>
                Orders
            </NavigationItem>
        </Navigation>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByRole("button", { name: "Catalog" })).toHaveAttribute("aria-expanded", "true");
        await expect(canvas.getByRole("button", { name: "Attributes" })).toHaveAttribute("aria-expanded", "true");
        await expect(canvas.getByRole("link", { name: "Colors" })).toBeVisible();
        await expect(canvas.getByRole("link", { name: "Colors" })).toHaveAttribute("aria-current", "page");
    },
};

/**
 * Pass `open` and update it in `onOpenChange` to control the groups, for example to keep only one group open
 * at a time. Controlled groups don't open by themselves when they contain the active item, so open the group of
 * the current page initially, here Catalog.
 */
export const OneGroupOpenAtATime: Story = {
    render: function OneOpenGroupNavigation(args) {
        const [openGroup, setOpenGroup] = useState<string | null>("catalog");

        return (
            <Navigation {...args}>
                <NavigationGroup
                    label="Catalog"
                    icon={<Icon name="products" />}
                    open={openGroup === "catalog"}
                    onOpenChange={(open) => setOpenGroup(open ? "catalog" : null)}
                >
                    <NavigationItem href="#products">Products</NavigationItem>
                    <NavigationItem href="#categories" active>
                        Categories
                    </NavigationItem>
                </NavigationGroup>
                <NavigationGroup
                    label="Settings"
                    icon={<Icon name="settings" />}
                    open={openGroup === "settings"}
                    onOpenChange={(open) => setOpenGroup(open ? "settings" : null)}
                >
                    <NavigationItem href="#users">Users</NavigationItem>
                    <NavigationItem href="#languages">Languages</NavigationItem>
                </NavigationGroup>
            </Navigation>
        );
    },
    play: async ({ canvas, userEvent }) => {
        const catalog = canvas.getByRole("button", { name: "Catalog" });
        const settings = canvas.getByRole("button", { name: "Settings" });
        const categories = canvas.getByRole("link", { name: "Categories" });

        await expect(catalog).toHaveAttribute("aria-expanded", "true");
        await expect(categories).toHaveAttribute("aria-current", "page");
        await expect(settings).toHaveAttribute("aria-expanded", "false");

        await userEvent.click(settings);
        await expect(settings).toHaveAttribute("aria-expanded", "true");
        await waitFor(() => expect(canvas.getByRole("link", { name: "Users", hidden: true })).toBeVisible());
        // `open` keeps Catalog closed, although it contains the active item.
        await expect(catalog).toHaveAttribute("aria-expanded", "false");
        await waitFor(() => expect(categories).not.toBeVisible());

        await userEvent.click(settings);
        await expect(settings).toHaveAttribute("aria-expanded", "false");
        await expect(catalog).toHaveAttribute("aria-expanded", "false");
    },
};

/**
 * Set `active` from the router's current location, here simulated with state: like a router's link, each item
 * changes the page without reloading it. When the current page changes, also through a link elsewhere on the
 * page, the groups around its item open by themselves. For a router's link, pass its link component as
 * `render`, for example `render={<Link to="/orders" />}`.
 */
export const CurrentPage: Story = {
    render: function CurrentPageNavigation(args) {
        const [currentPage, setCurrentPage] = useState("dashboard");

        function navigateTo(page: string) {
            return (event: MouseEvent) => {
                event.preventDefault();
                setCurrentPage(page);
            };
        }

        return (
            <>
                <Navigation {...args}>
                    <NavigationItem
                        href="#dashboard"
                        icon={<Icon name="dashboard" />}
                        active={currentPage === "dashboard"}
                        onClick={navigateTo("dashboard")}
                    >
                        Dashboard
                    </NavigationItem>
                    <NavigationItem href="#orders" icon={<Icon name="orders" />} active={currentPage === "orders"} onClick={navigateTo("orders")}>
                        Orders
                    </NavigationItem>
                    <NavigationGroup label="Settings" icon={<Icon name="settings" />}>
                        <NavigationItem href="#users" active={currentPage === "users"} onClick={navigateTo("users")}>
                            Users
                        </NavigationItem>
                        <NavigationItem href="#languages" active={currentPage === "languages"} onClick={navigateTo("languages")}>
                            Languages
                        </NavigationItem>
                    </NavigationGroup>
                </Navigation>
                <a href="#languages" className={styles.pageLink} onClick={navigateTo("languages")}>
                    Edit the languages
                </a>
            </>
        );
    },
    play: async ({ canvas, userEvent }) => {
        const dashboard = canvas.getByRole("link", { name: "Dashboard" });
        const orders = canvas.getByRole("link", { name: "Orders" });

        await expect(dashboard).toHaveAttribute("aria-current", "page");

        await userEvent.click(orders);
        await expect(orders).toHaveAttribute("aria-current", "page");
        await expect(dashboard).not.toHaveAttribute("aria-current");

        await userEvent.keyboard("{Shift>}{Tab}{/Shift}{Enter}");
        await expect(dashboard).toHaveFocus();
        await expect(dashboard).toHaveAttribute("aria-current", "page");

        const settings = canvas.getByRole("button", { name: "Settings" });
        const languages = canvas.getByRole("link", { name: "Languages", hidden: true });
        await expect(settings).toHaveAttribute("aria-expanded", "false");

        await userEvent.click(canvas.getByRole("link", { name: "Edit the languages" }));
        await expect(languages).toHaveAttribute("aria-current", "page");
        await expect(settings).toHaveAttribute("aria-expanded", "true");
        await waitFor(() => expect(languages).toBeVisible());
    },
};

/**
 * `className` styles the navigation itself, `slotProps` the inner parts of each entry: here the navigation
 * becomes a framed panel, and the `icon` of each item and group takes the primary color. Both are added to the
 * component's own classes. See "Foundations/Customization" for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        className: styles.framedNavigation,
    },
    render: (args) => (
        <Navigation {...args}>
            <NavigationItem href="#dashboard" icon={<Icon name="dashboard" />} slotProps={{ icon: { className: styles.accentIcon } }} active>
                Dashboard
            </NavigationItem>
            <NavigationItem href="#orders" icon={<Icon name="orders" />} slotProps={{ icon: { className: styles.accentIcon } }}>
                Orders
            </NavigationItem>
            <NavigationGroup label="Settings" icon={<Icon name="settings" />} slotProps={{ icon: { className: styles.accentIcon } }}>
                <NavigationItem href="#users">Users</NavigationItem>
                <NavigationItem href="#languages">Languages</NavigationItem>
            </NavigationGroup>
        </Navigation>
    ),
};
