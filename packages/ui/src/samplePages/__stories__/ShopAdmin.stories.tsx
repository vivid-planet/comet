import type { Meta, StoryObj } from "@storybook/react-vite";
import { type FormEvent, type PropsWithChildren, useId, useState } from "react";
import { flushSync } from "react-dom";
import { expect, screen, waitFor, within } from "storybook/test";

import { Alert } from "../../alert/Alert";
import { AppBar } from "../../appBar/AppBar";
import { AppBarButton } from "../../appBar/AppBarButton";
import { AppBarIconButton } from "../../appBar/AppBarIconButton";
import { AppBarSpacer } from "../../appBar/AppBarSpacer";
import { Autocomplete } from "../../autocomplete/Autocomplete";
import { Avatar } from "../../avatar/Avatar";
import { BreadcrumbItem } from "../../breadcrumbs/BreadcrumbItem";
import { Breadcrumbs } from "../../breadcrumbs/Breadcrumbs";
import { Button } from "../../button/Button";
import { Card } from "../../card/Card";
import { Checkbox } from "../../checkbox/Checkbox";
import { Chip, type ChipTone } from "../../chip/Chip";
import { ColorPicker } from "../../colorPicker/ColorPicker";
import { Dialog } from "../../dialog/Dialog";
import { DialogClose } from "../../dialog/DialogClose";
import { Icon } from "../../icon/Icon";
import { IconButton } from "../../iconButton/IconButton";
import { Menu } from "../../menu/Menu";
import { MenuGroup } from "../../menu/MenuGroup";
import { MenuItem } from "../../menu/MenuItem";
import { MenuLinkItem } from "../../menu/MenuLinkItem";
import { MenuSeparator } from "../../menu/MenuSeparator";
import { Navigation } from "../../navigation/Navigation";
import { NavigationGroup } from "../../navigation/NavigationGroup";
import { NavigationItem } from "../../navigation/NavigationItem";
import { NumberField } from "../../numberField/NumberField";
import { Radio } from "../../radioGroup/Radio";
import { RadioGroup } from "../../radioGroup/RadioGroup";
import { Select } from "../../select/Select";
import { Switch } from "../../switch/Switch";
import { Tab } from "../../tabs/Tab";
import { TabList } from "../../tabs/TabList";
import { TabPanel } from "../../tabs/TabPanel";
import { Tabs } from "../../tabs/Tabs";
import { TextField } from "../../textField/TextField";
import { ThemeSwitch, type ThemeSwitchColorScheme } from "../../themeSwitch/ThemeSwitch";
import { Tooltip } from "../../tooltip/Tooltip";
import { TooltipProvider } from "../../tooltip/TooltipProvider";
import { Typography } from "../../typography/Typography";
import styles from "./ShopAdmin.stories.module.css";

const meta = {
    title: "Sample pages/Shop admin",
    tags: ["!autodocs", "!manifest"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

type Page = "dashboard" | "products" | "orders" | "customers" | "settings";

interface ShopAdminProps extends PropsWithChildren {
    currentPage: Page;
    /** Gives the navigation a dark sidebar in the given theme, through a `ThemeSwitch`. */
    darkNavigationTheme?: string;
}

const userMenuItems = (
    <>
        <MenuLinkItem href="#profile" icon={<Icon name="user" />}>
            Profile
        </MenuLinkItem>
        <MenuLinkItem href="#settings" icon={<Icon name="settings" />}>
            Settings
        </MenuLinkItem>
        <MenuSeparator />
        <MenuItem icon={<Icon name="logout" />}>Log out</MenuItem>
    </>
);

const wideScreenQuery = "(width >= 48rem)";

/**
 * The frame of every page: the app bar across the top, the main navigation in a sidebar, and the page's content.
 * On a narrow screen, the navigation starts hidden behind its button, and on a phone, the app bar shows only the
 * user's avatar, with the name visually hidden, and moves "Help" into the user's menu.
 */
function ShopAdmin({ currentPage, darkNavigationTheme, children }: ShopAdminProps) {
    const navigationId = useId();
    const [isNavigationOpen, setIsNavigationOpen] = useState(() => window.matchMedia(wideScreenQuery).matches);

    const navigation = (
        <Navigation label="Main" id={navigationId}>
            <NavigationItem href="#dashboard" icon={<Icon name="dashboard" />} active={currentPage === "dashboard"}>
                Dashboard
            </NavigationItem>
            <NavigationGroup label="Catalog" icon={<Icon name="products" />} defaultOpen>
                <NavigationItem href="#products" active={currentPage === "products"}>
                    Products
                </NavigationItem>
                <NavigationItem href="#categories">Categories</NavigationItem>
                <NavigationItem href="#brands">Brands</NavigationItem>
            </NavigationGroup>
            <NavigationItem href="#orders" icon={<Icon name="orders" />} active={currentPage === "orders"}>
                Orders
            </NavigationItem>
            <NavigationItem href="#customers" icon={<Icon name="users" />} active={currentPage === "customers"}>
                Customers
            </NavigationItem>
            <NavigationItem href="#pages" icon={<Icon name="pages" />}>
                Pages
            </NavigationItem>
            <NavigationItem href="#settings" icon={<Icon name="settings" />} active={currentPage === "settings"}>
                Settings
            </NavigationItem>
        </Navigation>
    );

    return (
        <div className={styles.frame}>
            <div className={styles.application}>
                <AppBar className={styles.appBar}>
                    <AppBarIconButton
                        label="Navigation"
                        aria-expanded={isNavigationOpen}
                        aria-controls={navigationId}
                        onClick={() => setIsNavigationOpen(!isNavigationOpen)}
                    >
                        <Icon name="menu" />
                    </AppBarIconButton>
                    <span className={styles.productName}>Linen & Co.</span>
                    <AppBarSpacer />
                    <TooltipProvider>
                        <Tooltip content="Help">
                            <AppBarIconButton label="Help" className={styles.helpButton}>
                                <Icon name="help" />
                            </AppBarIconButton>
                        </Tooltip>
                        <Tooltip content="Notifications">
                            <AppBarIconButton label="Notifications">
                                <Icon name="bell" />
                            </AppBarIconButton>
                        </Tooltip>
                    </TooltipProvider>
                    <Menu
                        align="end"
                        trigger={
                            <AppBarButton
                                className={styles.userButton}
                                startIcon={<Avatar name="Jane Doe" size="small" />}
                                endIcon={<Icon name="chevron-down" />}
                            >
                                Jane Doe
                            </AppBarButton>
                        }
                    >
                        {userMenuItems}
                    </Menu>
                    <Menu
                        align="end"
                        trigger={
                            <AppBarButton className={styles.compactUserButton} startIcon={<Avatar name="Jane Doe" size="small" />}>
                                <span className={styles.visuallyHidden}>Jane Doe</span>
                            </AppBarButton>
                        }
                    >
                        <MenuItem icon={<Icon name="help" />}>Help</MenuItem>
                        <MenuSeparator />
                        {userMenuItems}
                    </Menu>
                </AppBar>
                {isNavigationOpen &&
                    (darkNavigationTheme === undefined ? (
                        <div className={styles.sidebar}>{navigation}</div>
                    ) : (
                        <ThemeSwitch theme={darkNavigationTheme} colorScheme="dark" className={styles.sidebar}>
                            {navigation}
                        </ThemeSwitch>
                    ))}
                <main className={styles.content}>{children}</main>
            </div>
        </div>
    );
}

function preventSubmit(event: FormEvent) {
    event.preventDefault();
}

interface Order {
    number: string;
    customer: string;
    date: string;
    status: { label: string; tone: ChipTone };
    total: string;
}

const recentOrders: Order[] = [
    { number: "10482", customer: "Mia Fischer", date: "Today, 09:41", status: { label: "Paid", tone: "success" }, total: "€184.00" },
    { number: "10481", customer: "Noah Weber", date: "Today, 08:12", status: { label: "Awaiting payment", tone: "warning" }, total: "€59.00" },
    { number: "10480", customer: "Emma Schneider", date: "Yesterday", status: { label: "Shipped", tone: "primary" }, total: "€312.50" },
    { number: "10479", customer: "Liam Wagner", date: "Yesterday", status: { label: "Refunded", tone: "neutral" }, total: "€74.90" },
    { number: "10478", customer: "Sofia Becker", date: "Mon, 20 Oct", status: { label: "Payment failed", tone: "danger" }, total: "€129.00" },
];

/**
 * The start page: the most important numbers, what needs attention, and the latest orders. An `Alert` reports
 * what affects the whole shop, cards group the numbers and lists, and chips show each order's status.
 */
export const Dashboard: Story = {
    render: () => (
        <ShopAdmin currentPage="dashboard">
            <div className={styles.pageHeader}>
                <div>
                    <Typography variant="overline" tone="muted">
                        Tuesday, 21 October
                    </Typography>
                    <Typography variant="heading1" render={<h1 />}>
                        Good morning, Jane
                    </Typography>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="secondary" startIcon={<Icon name="download" />}>
                        Export report
                    </Button>
                    <Button startIcon={<Icon name="plus" />}>Add product</Button>
                </div>
            </div>
            <Alert
                tone="warning"
                title="3 products are out of stock"
                action={
                    <a href="#products" className={styles.actionLink}>
                        Show products
                    </a>
                }
            >
                Customers can't order them until you restock them.
            </Alert>
            <div className={styles.stats}>
                <Card title="Orders today">
                    <Typography variant="heading2" render={<p />}>
                        128
                    </Typography>
                    <Typography variant="bodySmall" tone="muted" render={<p />} className={styles.trend}>
                        <Chip tone="success">+12%</Chip> compared with last Tuesday
                    </Typography>
                </Card>
                <Card title="Revenue today">
                    <Typography variant="heading2" render={<p />}>
                        €12,480
                    </Typography>
                    <Typography variant="bodySmall" tone="muted" render={<p />} className={styles.trend}>
                        <Chip tone="success">+8%</Chip> compared with last Tuesday
                    </Typography>
                </Card>
                <Card title="Average order">
                    <Typography variant="heading2" render={<p />}>
                        €97.50
                    </Typography>
                    <Typography variant="bodySmall" tone="muted" render={<p />} className={styles.trend}>
                        <Chip tone="warning">−3%</Chip> compared with last Tuesday
                    </Typography>
                </Card>
                <Card title="Open returns">
                    <Typography variant="heading2" render={<p />}>
                        4
                    </Typography>
                    <Typography variant="bodySmall" tone="muted" render={<p />} className={styles.trend}>
                        <Chip>±0</Chip> compared with last Tuesday
                    </Typography>
                </Card>
            </div>
            <div className={styles.columns}>
                <Card
                    title="Recent orders"
                    actions={
                        <a href="#orders" className={styles.actionLink}>
                            All orders
                            <Icon name="arrow-right" />
                        </a>
                    }
                >
                    <div className={styles.tableScroller}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th scope="col">Order</th>
                                    <th scope="col">Customer</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" className={styles.numeric}>
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.number}>
                                        <td>
                                            <a href={`#order-${order.number}`} className={styles.link}>
                                                #{order.number}
                                            </a>
                                            <Typography variant="bodySmall" tone="muted">
                                                {order.date}
                                            </Typography>
                                        </td>
                                        <td>
                                            <span className={styles.person}>
                                                <Avatar name={order.customer} size="small" aria-hidden />
                                                {order.customer}
                                            </span>
                                        </td>
                                        <td>
                                            <Chip tone={order.status.tone}>{order.status.label}</Chip>
                                        </td>
                                        <td className={styles.numeric}>{order.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
                <Card title="To do" description="What needs your attention today.">
                    <div className={styles.stack}>
                        <Checkbox defaultChecked>Answer 2 customer questions</Checkbox>
                        <Checkbox>Restock the linen shirt in size M</Checkbox>
                        <Checkbox>Approve 5 product reviews</Checkbox>
                        <Checkbox>Plan the winter sale</Checkbox>
                    </div>
                </Card>
            </div>
        </ShopAdmin>
    ),
    play: async ({ canvas, userEvent }) => {
        const navigationButton = canvas.getByRole("button", { name: "Navigation" });

        async function expectNavigationOpen(isOpen: boolean) {
            await expect(navigationButton).toHaveAttribute("aria-expanded", String(isOpen));
            if (isOpen) {
                await expect(canvas.getByRole("navigation", { name: "Main" })).toBeVisible();
                await expect(canvas.getByRole("link", { name: "Dashboard" })).toHaveAttribute("aria-current", "page");
            } else {
                await expect(canvas.queryByRole("navigation", { name: "Main" })).not.toBeInTheDocument();
            }
        }

        const isInitiallyOpen = window.matchMedia(wideScreenQuery).matches;
        await expectNavigationOpen(isInitiallyOpen);

        await userEvent.click(navigationButton);
        await expectNavigationOpen(!isInitiallyOpen);

        await userEvent.click(navigationButton);
        await expectNavigationOpen(isInitiallyOpen);
    },
};

interface Product {
    name: string;
    sku: string;
    category: string;
    price: string;
    stock: number;
    status: { label: string; tone: ChipTone };
}

const products: Product[] = [
    { name: "Linen shirt", sku: "LS-1042", category: "Shirts", price: "€59.00", stock: 42, status: { label: "Published", tone: "success" } },
    { name: "Wool scarf", sku: "WS-2210", category: "Accessories", price: "€39.00", stock: 0, status: { label: "Published", tone: "success" } },
    { name: "Canvas tote bag", sku: "CT-3301", category: "Bags", price: "€24.00", stock: 118, status: { label: "Published", tone: "success" } },
    { name: "Merino sweater", sku: "MS-1187", category: "Knitwear", price: "€119.00", stock: 7, status: { label: "Draft", tone: "neutral" } },
    { name: "Cotton chinos", sku: "CC-1503", category: "Trousers", price: "€79.00", stock: 0, status: { label: "Published", tone: "success" } },
    { name: "Leather belt", sku: "LB-4120", category: "Accessories", price: "€49.00", stock: 23, status: { label: "Archived", tone: "warning" } },
];

const categoryOptions = [
    { value: "all", label: "All categories" },
    { value: "accessories", label: "Accessories" },
    { value: "bags", label: "Bags" },
    { value: "knitwear", label: "Knitwear" },
    { value: "shirts", label: "Shirts" },
    { value: "trousers", label: "Trousers" },
];

const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
];

/**
 * The actions of one row: a menu behind an icon button, whose destructive action asks to confirm in a dialog that
 * names the product.
 */
function ProductActions({ product }: { product: Product }) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <>
            <Menu
                align="end"
                trigger={
                    <IconButton label={`Actions for ${product.name}`} variant="ghost" size="small">
                        <Icon name="more" />
                    </IconButton>
                }
            >
                <MenuLinkItem href={`#product-${product.sku}`} icon={<Icon name="edit" />}>
                    Edit
                </MenuLinkItem>
                <MenuItem icon={<Icon name="copy" />}>Duplicate</MenuItem>
                <MenuLinkItem href={`#preview-${product.sku}`} icon={<Icon name="external-link" />}>
                    View in shop
                </MenuLinkItem>
                <MenuSeparator />
                <MenuItem icon={<Icon name="delete" />} tone="danger" onClick={() => setIsDeleteDialogOpen(true)}>
                    Delete
                </MenuItem>
            </Menu>
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                size="small"
                title="Delete product?"
                description={`This permanently deletes “${product.name}”. You can't undo this.`}
                actions={
                    <>
                        <DialogClose>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button onClick={() => setIsDeleteDialogOpen(false)}>Delete</Button>
                    </>
                }
            />
        </>
    );
}

/**
 * A list of records: breadcrumbs, the title with the primary action and a menu of further actions, filters, and a
 * table in a card, with a menu of actions in every row.
 */
export const Products: Story = {
    render: () => (
        <ShopAdmin currentPage="products">
            <div className={styles.pageHeader}>
                <div>
                    <Breadcrumbs label="Breadcrumbs">
                        <BreadcrumbItem href="#catalog">Catalog</BreadcrumbItem>
                        <BreadcrumbItem current>Products</BreadcrumbItem>
                    </Breadcrumbs>
                    <Typography variant="heading1" render={<h1 />}>
                        Products
                    </Typography>
                </div>
                <div className={styles.headerActions}>
                    <Menu
                        align="end"
                        trigger={
                            <IconButton label="More actions" variant="secondary">
                                <Icon name="more" />
                            </IconButton>
                        }
                    >
                        <MenuItem icon={<Icon name="upload" />}>Import products</MenuItem>
                        <MenuSeparator />
                        <MenuGroup label="Export as">
                            <MenuItem icon={<Icon name="download" />}>CSV</MenuItem>
                            <MenuItem icon={<Icon name="download" />}>Excel</MenuItem>
                        </MenuGroup>
                    </Menu>
                    <Button startIcon={<Icon name="plus" />}>Add product</Button>
                </div>
            </div>
            <Alert tone="info">2 products are out of stock and hidden in the shop.</Alert>
            <Card>
                <div className={styles.filters}>
                    <TextField label="Search" type="search" placeholder="Name or SKU" />
                    <Select label="Category" options={categoryOptions} defaultValue="all" />
                    <Select label="Status" options={statusOptions} defaultValue="all" />
                </div>
                <div className={styles.tableScroller}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">Product</th>
                                <th scope="col">Category</th>
                                <th scope="col" className={styles.numeric}>
                                    Price
                                </th>
                                <th scope="col" className={styles.numeric}>
                                    Stock
                                </th>
                                <th scope="col">Status</th>
                                <th scope="col">
                                    <span className={styles.visuallyHidden}>Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.sku}>
                                    <td>
                                        <span className={styles.product}>
                                            <span className={styles.thumbnail}>
                                                <Icon name="image" />
                                            </span>
                                            <span>
                                                <a href={`#product-${product.sku}`} className={styles.link}>
                                                    {product.name}
                                                </a>
                                                <Typography variant="bodySmall" tone="muted">
                                                    {product.sku}
                                                </Typography>
                                            </span>
                                        </span>
                                    </td>
                                    <td>{product.category}</td>
                                    <td className={styles.numeric}>{product.price}</td>
                                    <td className={styles.numeric}>{product.stock > 0 ? product.stock : <Chip tone="danger">Out of stock</Chip>}</td>
                                    <td>
                                        <Chip tone={product.status.tone}>{product.status.label}</Chip>
                                    </td>
                                    <td className={styles.rowActions}>
                                        <ProductActions product={product} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </ShopAdmin>
    ),
    play: async ({ canvas, userEvent }) => {
        const actionsButton = canvas.getByRole("button", { name: "Actions for Wool scarf" });
        await userEvent.click(actionsButton);
        await userEvent.click(await screen.findByRole("menuitem", { name: "Delete" }));

        const dialog = await screen.findByRole("dialog", { name: "Delete product?" });
        await expect(dialog).toHaveAccessibleDescription("This permanently deletes “Wool scarf”. You can't undo this.");

        await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
        await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    },
};

const productCategoryOptions = [
    "Accessories",
    "Bags",
    "Belts",
    "Blazers",
    "Coats",
    "Dresses",
    "Hats",
    "Jackets",
    "Jeans",
    "Knitwear",
    "Linen",
    "Scarves",
    "Shirts",
    "Shoes",
    "Shorts",
    "Skirts",
    "Socks",
    "Sweaters",
    "T-shirts",
    "Trousers",
].map((label) => ({ value: label.toLowerCase(), label }));

const labelColorPresets = [
    { value: "#1f6feb", label: "Blue" },
    { value: "#1a7f37", label: "Green" },
    { value: "#bf3989", label: "Pink" },
    { value: "#c2410c", label: "Orange" },
];

/**
 * The product's form, which the "Save" button in the page header submits. Its panels stay mounted, so the entries
 * survive switching tabs and every field is submitted.
 */
function ProductForm() {
    const [selectedTab, setSelectedTab] = useState("general");

    function selectTabOfFirstInvalidField(event: FormEvent<HTMLFormElement>) {
        const tab = event.currentTarget.querySelector(":invalid")?.closest<HTMLElement>("[data-tab]")?.dataset.tab;
        if (tab !== undefined) {
            // Synchronously, so the browser can focus the field and show its error: it can't in a hidden panel.
            flushSync(() => setSelectedTab(tab));
        }
    }

    return (
        <form id="product-form" onSubmit={preventSubmit} onInvalidCapture={selectTabOfFirstInvalidField}>
            <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(String(value))}>
                <TabList label="Product">
                    <Tab value="general">General</Tab>
                    <Tab value="prices">Price and stock</Tab>
                    <Tab value="search">Search engines</Tab>
                </TabList>
                <TabPanel value="general" keepMounted data-tab="general">
                    <div className={styles.formColumns}>
                        <Card title="Basics">
                            <div className={styles.fields}>
                                <TextField label="Name" name="name" defaultValue="Linen shirt" required />
                                <TextField
                                    label="Slug"
                                    name="slug"
                                    defaultValue="linen-shirt"
                                    description="The end of the product's address: linen-and-co.com/products/linen-shirt."
                                    required
                                />
                                <Autocomplete
                                    label="Category"
                                    name="category"
                                    options={productCategoryOptions}
                                    defaultValue="shirts"
                                    emptyMessage="No category matches. Check the spelling."
                                />
                                <Select label="Status" name="status" options={statusOptions.slice(1)} defaultValue="published" />
                            </div>
                        </Card>
                        <Card title="Presentation" description="How the product appears in the shop.">
                            <div className={styles.fields}>
                                <ColorPicker
                                    label="Label color"
                                    name="labelColor"
                                    defaultValue="#c2410c"
                                    presets={labelColorPresets}
                                    pickerLabel="Pick the label color"
                                    description="The color of the “New” label on the product's picture."
                                />
                                <Checkbox name="showOnStartPage" defaultChecked>
                                    Show on the start page
                                </Checkbox>
                                <Checkbox name="giftWrapping">Offer gift wrapping</Checkbox>
                            </div>
                        </Card>
                    </div>
                </TabPanel>
                <TabPanel value="prices" keepMounted data-tab="prices">
                    <div className={styles.formColumns}>
                        <Card title="Price">
                            <div className={styles.fields}>
                                <NumberField
                                    label="Price"
                                    name="price"
                                    defaultValue={59}
                                    min={0}
                                    step={0.5}
                                    format={{ style: "currency", currency: "EUR" }}
                                    decrementLabel="Decrease the price"
                                    incrementLabel="Increase the price"
                                    required
                                />
                                <NumberField
                                    label="Discount"
                                    name="discount"
                                    defaultValue={0.1}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    format={{ style: "percent" }}
                                    description="Shown as a crossed-out price in the shop."
                                />
                            </div>
                        </Card>
                        <Card title="Stock">
                            <div className={styles.fields}>
                                <NumberField label="In stock" name="stock" defaultValue={42} min={0} />
                                <Checkbox name="trackStock" defaultChecked>
                                    Hide the product while it is out of stock
                                </Checkbox>
                            </div>
                        </Card>
                    </div>
                </TabPanel>
                <TabPanel value="search" keepMounted data-tab="search">
                    <Card title="Search engines" description="How search engines show the product.">
                        <div className={styles.fields}>
                            <TextField label="Title" name="seoTitle" defaultValue="Linen shirt – Linen & Co." />
                            <TextField
                                label="Description"
                                name="seoDescription"
                                defaultValue="A light, breathable shirt made of pure European linen."
                            />
                        </div>
                    </Card>
                </TabPanel>
            </Tabs>
        </form>
    );
}

/**
 * A form that edits one record. The title row holds the record's status and the actions, `Tabs` split the long
 * form into sections, and cards group the related fields within a section.
 */
export const Product: Story = {
    render: () => (
        <ShopAdmin currentPage="products">
            <div className={styles.pageHeader}>
                <div>
                    <Breadcrumbs label="Breadcrumbs">
                        <BreadcrumbItem href="#catalog">Catalog</BreadcrumbItem>
                        <BreadcrumbItem href="#products">Products</BreadcrumbItem>
                        <BreadcrumbItem current>Linen shirt</BreadcrumbItem>
                    </Breadcrumbs>
                    <div className={styles.titleRow}>
                        <Typography variant="heading1" render={<h1 />}>
                            Linen shirt
                        </Typography>
                        <Chip tone="success">Published</Chip>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="secondary" startIcon={<Icon name="eye" />}>
                        Preview
                    </Button>
                    <Button type="submit" form="product-form">
                        Save
                    </Button>
                </div>
            </div>
            <ProductForm />
        </ShopAdmin>
    ),
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole("tab", { name: "Price and stock" }));
        const stock = canvas.getByRole("textbox", { name: "In stock" });
        await userEvent.clear(stock);
        await userEvent.type(stock, "40");

        await userEvent.click(canvas.getByRole("tab", { name: "General" }));
        await expect(canvas.getByRole("textbox", { name: "Name" })).toHaveValue("Linen shirt");

        await userEvent.click(canvas.getByRole("tab", { name: "Price and stock" }));
        await expect(canvas.getByRole("textbox", { name: "In stock" })).toHaveValue("40");
        await expect(canvas.getByRole("textbox", { name: "Price" })).toHaveValue("€59.00");

        await userEvent.click(canvas.getByRole("tab", { name: "General" }));
    },
};

const themes = [
    { value: "dextinity", label: "Dextinity" },
    { value: "sunset", label: "Sunset" },
    { value: "acme", label: "Acme" },
    { value: "volt", label: "Volt" },
    { value: "tropic", label: "Tropic" },
    { value: "nova", label: "Nova" },
    { value: "primo", label: "Primo" },
];

/** The appearance settings, with a preview of the picked theme inside a `ThemeSwitch`. */
function AppearanceSettings() {
    const [theme, setTheme] = useState("dextinity");
    const [colorScheme, setColorScheme] = useState<ThemeSwitchColorScheme>("light");

    return (
        <div className={styles.appearance}>
            <div className={styles.fields}>
                <RadioGroup label="Theme" name="theme" value={theme} onValueChange={(value) => setTheme(String(value))}>
                    {themes.map((option) => (
                        <Radio key={option.value} value={option.value}>
                            {option.label}
                        </Radio>
                    ))}
                </RadioGroup>
                <RadioGroup
                    label="Color scheme"
                    name="colorScheme"
                    value={colorScheme}
                    onValueChange={(value) => setColorScheme(value === "dark" ? "dark" : "light")}
                >
                    <Radio value="light">Light</Radio>
                    <Radio value="dark">Dark</Radio>
                </RadioGroup>
            </div>
            <ThemeSwitch theme={theme} colorScheme={colorScheme} className={styles.preview} data-testid="appearance-preview">
                <Typography variant="overline" tone="muted">
                    Preview
                </Typography>
                <Typography variant="heading4" render={<p />}>
                    Linen shirt
                </Typography>
                <span className={styles.previewRow}>
                    <Chip tone="success">Published</Chip>
                    <Chip tone="warning">7 in stock</Chip>
                </span>
                <span className={styles.previewRow}>
                    <Button>Save</Button>
                    <Button variant="secondary">Preview</Button>
                </span>
            </ThemeSwitch>
        </div>
    );
}

/**
 * Settings in cards, one per topic. The appearance card previews the theme the user picks in a `ThemeSwitch`,
 * which gives a part of the page another theme or color scheme.
 */
export const Settings: Story = {
    render: () => (
        <ShopAdmin currentPage="settings">
            <Typography variant="heading1" render={<h1 />}>
                Settings
            </Typography>
            <div className={styles.settings}>
                <Card title="Profile" actions={<Button variant="secondary">Change picture</Button>}>
                    <form className={styles.profile} onSubmit={preventSubmit}>
                        <Avatar name="Jane Doe" size="large" />
                        <div className={styles.fields}>
                            <TextField label="Name" name="name" defaultValue="Jane Doe" autoComplete="name" required />
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                defaultValue="jane.doe@linen-and-co.com"
                                autoComplete="email"
                                required
                            />
                            <div>
                                <Button type="submit">Save</Button>
                            </div>
                        </div>
                    </form>
                </Card>
                <Card title="Notifications" description="Changes take effect immediately.">
                    <div className={styles.stack}>
                        <Switch defaultChecked>Email me about new orders</Switch>
                        <Switch defaultChecked>Email me when a product is out of stock</Switch>
                        <Switch>Send me a weekly summary</Switch>
                    </div>
                </Card>
                <Card title="Appearance" description="How the admin looks to you.">
                    <AppearanceSettings />
                </Card>
            </div>
        </ShopAdmin>
    ),
    play: async ({ canvas, userEvent }) => {
        const preview = canvas.getByTestId("appearance-preview");
        await expect(preview).toHaveAttribute("data-dextinity-theme", "dextinity");

        await userEvent.click(canvas.getByRole("radio", { name: "Acme" }));
        await userEvent.click(canvas.getByRole("radio", { name: "Dark" }));
        await expect(preview).toHaveAttribute("data-dextinity-theme", "acme");
        await expect(preview).toHaveAttribute("data-dextinity-color-scheme", "dark");
    },
};

/**
 * The orders with a dark sidebar: a `ThemeSwitch` around the navigation keeps the theme picked in the toolbar and
 * switches only its color scheme.
 */
export const WithDarkNavigation: Story = {
    render: (_args, { globals }) => (
        <ShopAdmin currentPage="orders" darkNavigationTheme={String(globals.theme)}>
            <div className={styles.pageHeader}>
                <div>
                    <Typography variant="heading1" render={<h1 />}>
                        Orders
                    </Typography>
                </div>
            </div>
            <Card>
                <div className={styles.tableScroller}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th scope="col">Order</th>
                                <th scope="col">Customer</th>
                                <th scope="col">Date</th>
                                <th scope="col">Status</th>
                                <th scope="col" className={styles.numeric}>
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.number}>
                                    <td>
                                        <a href={`#order-${order.number}`} className={styles.link}>
                                            #{order.number}
                                        </a>
                                    </td>
                                    <td>
                                        <span className={styles.person}>
                                            <Avatar name={order.customer} size="small" aria-hidden />
                                            {order.customer}
                                        </span>
                                    </td>
                                    <td>{order.date}</td>
                                    <td>
                                        <Chip tone={order.status.tone}>{order.status.label}</Chip>
                                    </td>
                                    <td className={styles.numeric}>{order.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </ShopAdmin>
    ),
    play: async ({ canvas, userEvent }) => {
        const navigationButton = canvas.getByRole("button", { name: "Navigation" });
        if (navigationButton.getAttribute("aria-expanded") === "false") {
            await userEvent.click(navigationButton);
        }

        const sidebar = canvas.getByRole("navigation", { name: "Main" }).closest("[data-dextinity-theme]");
        await expect(sidebar).toHaveAttribute("data-dextinity-color-scheme", "dark");
    },
};
