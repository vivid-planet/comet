import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Typography } from "../../typography/Typography";
import { BreadcrumbItem } from "../BreadcrumbItem";
import { Breadcrumbs } from "../Breadcrumbs";
import styles from "./Breadcrumbs.stories.module.css";

const inPageHeader: Decorator = (Story) => (
    <div className={styles.pageHeader}>
        <Story />
    </div>
);

const inNarrowFrame: Decorator = (Story) => (
    <div className={styles.narrowFrame}>
        <Story />
    </div>
);

const meta = {
    component: Breadcrumbs,
    subcomponents: { BreadcrumbItem },
    title: "Components/Breadcrumbs",
    // The docs page is Breadcrumbs.mdx.
    tags: ["!autodocs"],
    args: {
        label: "Breadcrumb",
    },
    argTypes: {
        label: { control: "text" },
        // The items are JSX in the render functions, so that the documentation snippets show them as code.
        children: { control: false },
        className: { control: false },
        slotProps: { control: false },
    },
    render: (args) => (
        <Breadcrumbs {...args}>
            <BreadcrumbItem href="#catalog">Catalog</BreadcrumbItem>
            <BreadcrumbItem href="#products">Products</BreadcrumbItem>
            <BreadcrumbItem current>Running shoe</BreadcrumbItem>
        </Breadcrumbs>
    ),
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Links to the pages above the current one, and the current page last, marked with `current`. The current page
 * is plain text, so Tab moves through the links only. A chevron separates the items.
 */
export const Default: Story = {
    play: async ({ canvas, userEvent }) => {
        const catalog = canvas.getByRole("link", { name: "Catalog" });
        const products = canvas.getByRole("link", { name: "Products" });
        const currentPage = canvas.getByText("Running shoe");

        await expect(canvas.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
        await expect(canvas.getAllByRole("listitem")).toHaveLength(3);
        await expect(catalog).toHaveAttribute("href", "#catalog");
        await expect(currentPage).toHaveAttribute("aria-current", "page");
        await expect(currentPage).not.toHaveAttribute("href");
        await expect(canvas.getAllByRole("link")).toHaveLength(2);

        await userEvent.tab();
        await expect(catalog).toHaveFocus();
        await userEvent.tab();
        await expect(products).toHaveFocus();
        await userEvent.tab();
        await expect(document.body).toHaveFocus();
    },
};

/**
 * Put the breadcrumbs above the page's title, which names the current page once more in a larger size.
 */
export const AbovePageTitle: Story = {
    decorators: [inPageHeader],
    render: (args) => (
        <>
            <Breadcrumbs {...args}>
                <BreadcrumbItem href="#orders">Orders</BreadcrumbItem>
                <BreadcrumbItem current>Order 1024</BreadcrumbItem>
            </Breadcrumbs>
            <Typography variant="heading1">Order 1024</Typography>
        </>
    ),
};

/**
 * The items wrap onto further lines when space runs out; each line after the first starts with a chevron.
 * Shorten long page names instead of letting the breadcrumbs take several lines.
 */
export const Wrapping: Story = {
    decorators: [inNarrowFrame],
    render: (args) => (
        <Breadcrumbs {...args}>
            <BreadcrumbItem href="#catalog">Catalog</BreadcrumbItem>
            <BreadcrumbItem href="#products">Products</BreadcrumbItem>
            <BreadcrumbItem href="#shoes">Shoes and accessories</BreadcrumbItem>
            <BreadcrumbItem current>Lightweight running shoe</BreadcrumbItem>
        </Breadcrumbs>
    ),
    play: async ({ canvas }) => {
        const catalog = canvas.getByRole("link", { name: "Catalog" });
        const currentPage = canvas.getByText("Lightweight running shoe");

        await expect(currentPage.getBoundingClientRect().top).toBeGreaterThan(catalog.getBoundingClientRect().bottom);
    },
};

/**
 * `className` styles the breadcrumbs themselves, `slotProps` their inner parts and those of each item: here the
 * breadcrumbs sit in a framed bar, and each item's `separator` takes the primary color and more space on either
 * side. Both are added to the component's own classes. See "Foundations/Customization" for all ways to adjust a
 * component.
 */
export const CustomizedThroughSlotProps: Story = {
    args: {
        className: styles.framedBreadcrumbs,
    },
    render: (args) => (
        <Breadcrumbs {...args}>
            <BreadcrumbItem href="#catalog" slotProps={{ separator: { className: styles.accentSeparator } }}>
                Catalog
            </BreadcrumbItem>
            <BreadcrumbItem href="#products" slotProps={{ separator: { className: styles.accentSeparator } }}>
                Products
            </BreadcrumbItem>
            <BreadcrumbItem current slotProps={{ separator: { className: styles.accentSeparator } }}>
                Running shoe
            </BreadcrumbItem>
        </Breadcrumbs>
    ),
};
