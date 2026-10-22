import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, waitFor } from "storybook/test";

import { Icon } from "../../icon/Icon";
import { Typography } from "../../typography/Typography";
import { Tab } from "../Tab";
import { TabList } from "../TabList";
import { TabPanel } from "../TabPanel";
import { Tabs } from "../Tabs";
import styles from "./Tabs.stories.module.css";

const inFrame: Decorator = (Story) => (
    <div className={styles.frame}>
        <Story />
    </div>
);

const inNarrowFrame: Decorator = (Story) => (
    <div className={styles.narrowFrame}>
        <Story />
    </div>
);

const meta = {
    component: Tabs,
    subcomponents: { TabList, Tab, TabPanel },
    title: "Components/Tabs",
    // The docs page is Tabs.mdx.
    tags: ["!autodocs"],
    decorators: [inFrame],
    args: {
        defaultValue: "overview",
        onValueChange: fn(),
    },
    argTypes: {
        orientation: { control: "radio", options: ["horizontal", "vertical"] },
        defaultValue: { control: "text" },
        value: { control: "text" },
        // The tabs and panels are JSX in the render functions, so that the documentation snippets show them as code.
        children: { control: false },
        className: { control: false },
        style: { control: false },
    },
    render: (args) => (
        <Tabs {...args}>
            <TabList label="Product">
                <Tab value="overview">Overview</Tab>
                <Tab value="pricing">Pricing</Tab>
                <Tab value="inventory">Inventory</Tab>
            </TabList>
            <TabPanel value="overview">
                <Typography>The product&apos;s name, description and images.</Typography>
            </TabPanel>
            <TabPanel value="pricing">
                <Typography>The product&apos;s price, taxes and discounts.</Typography>
            </TabPanel>
            <TabPanel value="inventory">
                <Typography>The product&apos;s stock in each warehouse.</Typography>
            </TabPanel>
        </Tabs>
    ),
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Three views of a product, one panel at a time. Clicking a tab selects it. Tab moves focus to the selected
 * tab, the arrow keys move focus between the tabs, and Enter or Space selects the focused one.
 */
export const Default: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const overview = canvas.getByRole("tab", { name: "Overview" });
        const pricing = canvas.getByRole("tab", { name: "Pricing" });
        const inventory = canvas.getByRole("tab", { name: "Inventory" });

        await expect(overview).toHaveAttribute("aria-selected", "true");
        await expect(canvas.getByRole("tabpanel", { name: "Overview" })).toBeVisible();

        await userEvent.click(pricing);
        await expect(pricing).toHaveAttribute("aria-selected", "true");
        await expect(canvas.getByRole("tabpanel", { name: "Pricing" })).toHaveTextContent("The product's price, taxes and discounts.");
        await expect(args.onValueChange).toHaveBeenLastCalledWith("pricing", expect.anything());

        await userEvent.keyboard("{ArrowRight}");
        await expect(inventory).toHaveFocus();
        await expect(pricing).toHaveAttribute("aria-selected", "true");

        await userEvent.keyboard("{Enter}");
        await expect(inventory).toHaveAttribute("aria-selected", "true");
        await expect(args.onValueChange).toHaveBeenLastCalledWith("inventory", expect.anything());

        await userEvent.keyboard("{ArrowRight}");
        await expect(overview).toHaveFocus();

        await userEvent.tab();
        await expect(canvas.getByRole("tabpanel", { name: "Inventory" })).toHaveFocus();
    },
};

/**
 * An icon before the label helps users find a tab they've used before. It doesn't replace the label, which
 * names the tab for everyone.
 */
export const WithIcons: Story = {
    args: {
        defaultValue: "dashboard",
    },
    render: (args) => (
        <Tabs {...args}>
            <TabList label="Shop">
                <Tab value="dashboard" icon={<Icon name="dashboard" />}>
                    Dashboard
                </Tab>
                <Tab value="orders" icon={<Icon name="orders" />}>
                    Orders
                </Tab>
                <Tab value="customers" icon={<Icon name="users" />}>
                    Customers
                </Tab>
            </TabList>
            <TabPanel value="dashboard">
                <Typography>Sales and visitors of the last 30 days.</Typography>
            </TabPanel>
            <TabPanel value="orders">
                <Typography>The orders that wait for shipping.</Typography>
            </TabPanel>
            <TabPanel value="customers">
                <Typography>The customers who ordered this month.</Typography>
            </TabPanel>
        </Tabs>
    ),
    play: async ({ canvas, userEvent }) => {
        const orders = canvas.getByRole("tab", { name: "Orders" });

        await userEvent.click(orders);
        await expect(orders).toHaveAttribute("aria-selected", "true");
        await expect(canvas.getByRole("tabpanel", { name: "Orders" })).toBeVisible();
    },
};

/**
 * A column of tabs beside the panels suits many tabs or longer labels, such as the sections of a settings
 * page. The up and down arrow keys move focus between the tabs.
 */
export const Vertical: Story = {
    args: {
        orientation: "vertical",
        defaultValue: "general",
    },
    render: (args) => (
        <Tabs {...args}>
            <TabList label="Settings">
                <Tab value="general">General</Tab>
                <Tab value="notifications">Notifications</Tab>
                <Tab value="security">Security and sign-in</Tab>
                <Tab value="billing">Billing</Tab>
            </TabList>
            <TabPanel value="general">
                <Typography>The shop&apos;s name, language and time zone.</Typography>
            </TabPanel>
            <TabPanel value="notifications">
                <Typography>The emails you receive about orders and payments.</Typography>
            </TabPanel>
            <TabPanel value="security">
                <Typography>Your password and two-factor authentication.</Typography>
            </TabPanel>
            <TabPanel value="billing">
                <Typography>Your plan, invoices and payment method.</Typography>
            </TabPanel>
        </Tabs>
    ),
    play: async ({ args, canvas, userEvent }) => {
        const general = canvas.getByRole("tab", { name: "General" });
        const notifications = canvas.getByRole("tab", { name: "Notifications" });

        await expect(canvas.getByRole("tablist", { name: "Settings" })).toHaveAttribute("aria-orientation", "vertical");

        await userEvent.click(general);
        await userEvent.keyboard("{ArrowDown}");
        await expect(notifications).toHaveFocus();

        await userEvent.keyboard("{ArrowRight}");
        await expect(notifications).toHaveFocus();

        await userEvent.keyboard(" ");
        await expect(notifications).toHaveAttribute("aria-selected", "true");
        await expect(args.onValueChange).toHaveBeenLastCalledWith("notifications", expect.anything());
    },
};

/**
 * Where the column of tabs leaves too little room for the panel, as on a phone, the panel moves below the
 * tabs. The tabs stay a column, and the up and down arrow keys still move between them.
 */
export const VerticalOnANarrowScreen: Story = {
    decorators: [inNarrowFrame],
    args: {
        orientation: "vertical",
        defaultValue: "general",
    },
    render: (args) => (
        <Tabs {...args}>
            <TabList label="Settings">
                <Tab value="general">General</Tab>
                <Tab value="notifications">Notifications</Tab>
                <Tab value="security">Security and sign-in</Tab>
                <Tab value="billing">Billing</Tab>
            </TabList>
            <TabPanel value="general">
                <Typography>The shop&apos;s name, language and time zone.</Typography>
            </TabPanel>
            <TabPanel value="notifications">
                <Typography>The emails you receive about orders and payments.</Typography>
            </TabPanel>
            <TabPanel value="security">
                <Typography>Your password and two-factor authentication.</Typography>
            </TabPanel>
            <TabPanel value="billing">
                <Typography>Your plan, invoices and payment method.</Typography>
            </TabPanel>
        </Tabs>
    ),
    play: async ({ canvas, userEvent }) => {
        const tabList = canvas.getByRole("tablist", { name: "Settings" }).getBoundingClientRect();
        const panel = canvas.getByRole("tabpanel", { name: "General" }).getBoundingClientRect();

        await expect(panel.top).toBeGreaterThanOrEqual(tabList.bottom);
        await expect(panel.width).toBeGreaterThan(tabList.width);

        await userEvent.click(canvas.getByRole("tab", { name: "General" }));
        await userEvent.keyboard("{ArrowDown}");
        await expect(canvas.getByRole("tab", { name: "Notifications" })).toHaveFocus();
    },
};

/**
 * Tabs that each have their own URL, such as the sections of a product's page, render a link with `render`
 * and `nativeButton={false}`. Select the tab of the current URL with `value` on `Tabs`, here simulated with
 * state; with a router, read it from the URL.
 */
export const AsLinks: Story = {
    args: {
        defaultValue: undefined,
    },
    render: function LinkTabs(args) {
        const [section, setSection] = useState("overview");

        return (
            <Tabs {...args} value={section} onValueChange={setSection}>
                <TabList label="Product">
                    <Tab value="overview" render={<a href="#overview" />} nativeButton={false}>
                        Overview
                    </Tab>
                    <Tab value="pricing" render={<a href="#pricing" />} nativeButton={false}>
                        Pricing
                    </Tab>
                    <Tab value="inventory" render={<a href="#inventory" />} nativeButton={false}>
                        Inventory
                    </Tab>
                </TabList>
                <TabPanel value="overview">
                    <Typography>The product&apos;s name, description and images.</Typography>
                </TabPanel>
                <TabPanel value="pricing">
                    <Typography>The product&apos;s price, taxes and discounts.</Typography>
                </TabPanel>
                <TabPanel value="inventory">
                    <Typography>The product&apos;s stock in each warehouse.</Typography>
                </TabPanel>
            </Tabs>
        );
    },
    // Following a link would navigate the test's page, so the test stops short of selecting one.
    play: async ({ canvas, userEvent }) => {
        const overview = canvas.getByRole("tab", { name: "Overview" });
        const pricing = canvas.getByRole("tab", { name: "Pricing" });

        await expect(pricing.tagName).toBe("A");
        await expect(pricing).toHaveAttribute("href", "#pricing");
        await expect(overview).toHaveAttribute("aria-selected", "true");

        await userEvent.tab();
        await expect(overview).toHaveFocus();
        await userEvent.keyboard("{ArrowRight}");
        await expect(pricing).toHaveFocus();
    },
};

/**
 * Disable a tab whose content isn't available right now, and say why, for example in the selected panel. The
 * arrow keys still reach it, so screen reader users learn that it exists, but it can't be selected.
 */
export const WithDisabledTab: Story = {
    render: (args) => (
        <Tabs {...args}>
            <TabList label="Product">
                <Tab value="overview">Overview</Tab>
                <Tab value="pricing">Pricing</Tab>
                <Tab value="inventory" disabled>
                    Inventory
                </Tab>
            </TabList>
            <TabPanel value="overview">
                <Typography>The product&apos;s name, description and images. Its inventory is available once it is published.</Typography>
            </TabPanel>
            <TabPanel value="pricing">
                <Typography>The product&apos;s price, taxes and discounts.</Typography>
            </TabPanel>
            <TabPanel value="inventory">
                <Typography>The product&apos;s stock in each warehouse.</Typography>
            </TabPanel>
        </Tabs>
    ),
    play: async ({ args, canvas, userEvent }) => {
        const inventory = canvas.getByRole("tab", { name: "Inventory" });

        await expect(inventory).toHaveAttribute("aria-disabled", "true");

        await userEvent.click(inventory);
        await expect(inventory).toHaveAttribute("aria-selected", "false");
        await expect(args.onValueChange).not.toHaveBeenCalled();

        await userEvent.click(canvas.getByRole("tab", { name: "Pricing" }));
        await userEvent.keyboard("{ArrowRight}");
        await expect(inventory).toHaveFocus();
        await userEvent.keyboard("{Enter}");
        await expect(inventory).toHaveAttribute("aria-selected", "false");
        await expect(canvas.getByRole("tabpanel", { name: "Pricing" })).toBeVisible();
    },
};

/**
 * With `activateOnFocus` on the `TabList`, the arrow keys select the tab they move to. Use it when panels show
 * without delay, so moving through the tabs doesn't load content on every step.
 */
export const SelectedOnFocus: Story = {
    render: (args) => (
        <Tabs {...args}>
            <TabList label="Product" activateOnFocus>
                <Tab value="overview">Overview</Tab>
                <Tab value="pricing">Pricing</Tab>
                <Tab value="inventory">Inventory</Tab>
            </TabList>
            <TabPanel value="overview">
                <Typography>The product&apos;s name, description and images.</Typography>
            </TabPanel>
            <TabPanel value="pricing">
                <Typography>The product&apos;s price, taxes and discounts.</Typography>
            </TabPanel>
            <TabPanel value="inventory">
                <Typography>The product&apos;s stock in each warehouse.</Typography>
            </TabPanel>
        </Tabs>
    ),
    play: async ({ args, canvas, userEvent }) => {
        const pricing = canvas.getByRole("tab", { name: "Pricing" });

        await userEvent.tab();
        await expect(canvas.getByRole("tab", { name: "Overview" })).toHaveFocus();

        await userEvent.keyboard("{ArrowRight}");
        await expect(pricing).toHaveFocus();
        await expect(pricing).toHaveAttribute("aria-selected", "true");
        await expect(args.onValueChange).toHaveBeenLastCalledWith("pricing", expect.anything());
    },
};

/**
 * Pass `value` and update it in `onValueChange` when the selection lives in the application, for example to
 * switch tabs from elsewhere on the page.
 */
export const Controlled: Story = {
    args: {
        defaultValue: undefined,
    },
    render: function ControlledTabs(args) {
        const [selectedTab, setSelectedTab] = useState("overview");

        return (
            <Tabs {...args} value={selectedTab} onValueChange={setSelectedTab}>
                <TabList label="Product">
                    <Tab value="overview">Overview</Tab>
                    <Tab value="pricing">Pricing</Tab>
                    <Tab value="inventory">Inventory</Tab>
                </TabList>
                <TabPanel value="overview">
                    <Typography>The product&apos;s name, description and images.</Typography>
                </TabPanel>
                <TabPanel value="pricing">
                    <Typography>The product&apos;s price, taxes and discounts.</Typography>
                </TabPanel>
                <TabPanel value="inventory">
                    <Typography>The product&apos;s stock in each warehouse.</Typography>
                </TabPanel>
            </Tabs>
        );
    },
    play: async ({ canvas, userEvent }) => {
        const inventory = canvas.getByRole("tab", { name: "Inventory" });

        await userEvent.click(inventory);
        await expect(inventory).toHaveAttribute("aria-selected", "true");
        await expect(canvas.getByRole("tabpanel", { name: "Inventory" })).toBeVisible();
    },
};

/**
 * Tabs that don't fit in the row scroll sideways, and the keyboard scrolls the focused tab into view. Keep
 * the number of tabs small, so users see them all on most screens; a column of tabs fits more.
 */
export const ManyTabs: Story = {
    decorators: [inNarrowFrame],
    args: {
        defaultValue: "general",
    },
    render: (args) => (
        <Tabs {...args}>
            <TabList label="Settings">
                <Tab value="general" icon={<Icon name="settings" />}>
                    General
                </Tab>
                <Tab value="notifications">Notifications</Tab>
                <Tab value="security">Security</Tab>
                <Tab value="billing">Billing</Tab>
                <Tab value="integrations">Integrations</Tab>
            </TabList>
            <TabPanel value="general">
                <Typography>The shop&apos;s name, language and time zone.</Typography>
            </TabPanel>
            <TabPanel value="notifications">
                <Typography>The emails you receive about orders and payments.</Typography>
            </TabPanel>
            <TabPanel value="security">
                <Typography>Your password and two-factor authentication.</Typography>
            </TabPanel>
            <TabPanel value="billing">
                <Typography>Your plan, invoices and payment method.</Typography>
            </TabPanel>
            <TabPanel value="integrations">
                <Typography>The services connected to your shop.</Typography>
            </TabPanel>
        </Tabs>
    ),
    play: async ({ canvas, userEvent }) => {
        const tabList = canvas.getByRole("tablist", { name: "Settings" });
        const integrations = canvas.getByRole("tab", { name: "Integrations" });

        await expect(tabList.scrollWidth).toBeGreaterThan(tabList.clientWidth);

        await userEvent.click(canvas.getByRole("tab", { name: "General" }));
        await userEvent.keyboard("{End}");
        await expect(integrations).toHaveFocus();
        await waitFor(() => expect(tabList.scrollLeft).toBeGreaterThan(0));

        await userEvent.keyboard("{Enter}");
        await expect(integrations).toHaveAttribute("aria-selected", "true");
    },
};

/**
 * `className` styles a component's own element, `slotProps` the inner parts of a `TabList` and a `Tab`. Both are
 * added to the components' own classes: here more room between the tab list and the panels, a thicker
 * indicator and icons in the primary color. See "Foundations/Customization" for all ways to adjust a component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        defaultValue: "dashboard",
        className: styles.roomyTabs,
    },
    render: (args) => (
        <Tabs {...args}>
            <TabList label="Shop" slotProps={{ indicator: { className: styles.thickIndicator } }}>
                <Tab value="dashboard" icon={<Icon name="dashboard" />} slotProps={{ icon: { className: styles.accentIcon } }}>
                    Dashboard
                </Tab>
                <Tab value="orders" icon={<Icon name="orders" />} slotProps={{ icon: { className: styles.accentIcon } }}>
                    Orders
                </Tab>
                <Tab value="customers" icon={<Icon name="users" />} slotProps={{ icon: { className: styles.accentIcon } }}>
                    Customers
                </Tab>
            </TabList>
            <TabPanel value="dashboard">
                <Typography>Sales and visitors of the last 30 days.</Typography>
            </TabPanel>
            <TabPanel value="orders">
                <Typography>The orders that wait for shipping.</Typography>
            </TabPanel>
            <TabPanel value="customers">
                <Typography>The customers who ordered this month.</Typography>
            </TabPanel>
        </Tabs>
    ),
};
