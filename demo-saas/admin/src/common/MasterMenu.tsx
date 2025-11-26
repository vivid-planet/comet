import { Dashboard, Snips, Wrench } from "@comet/admin-icons";
import { CronJobsPage, MasterMenu, type MasterMenuData, PublisherPage, UserPermissionsPage, WarningsPage } from "@comet/cms-admin";
import { DashboardPage } from "@src/dashboard/DashboardPage";
import { CreateCapProductPage } from "@src/products/generator/CreateCapProductPage";
import { ManufacturersPage } from "@src/products/generator/ManufacturersPage";
import { ProductCategoriesPage } from "@src/products/generator/ProductCategoriesPage";
import { ProductHighlightsPage } from "@src/products/generator/ProductHighlightsPage";
import { ProductsPage } from "@src/products/generator/ProductsPage";
import { ProductsWithLowPricePage } from "@src/products/generator/ProductsWithLowPricePage";
import { ProductTagsPage } from "@src/products/generator/ProductTagsPage";
import { ProductHighlightsPage as ProductHighlightsHandmadePage } from "@src/products/highlights/ProductHighlightsPage";
import { ManufacturersPage as ManufacturersHandmadePage } from "@src/products/ManufacturersPage";
import { ProductCategoriesPage as ProductCategoriesHandmadePage } from "@src/products/ProductCategoriesPage";
import ProductsHandmadePage from "@src/products/ProductsPage";
import { ProductTagsPage as ProductTagsHandmadePage } from "@src/products/tags/ProductTagsPage";
import { FormattedMessage } from "react-intl";

export const masterMenuData: MasterMenuData = [
    {
        type: "route",
        primary: <FormattedMessage id="menu.dashboard" defaultMessage="Dashboard" />,
        icon: <Dashboard />,
        route: {
            path: "/dashboard",
            component: DashboardPage,
        },
    },
    {
        type: "collapsible",
        primary: <FormattedMessage id="menu.system" defaultMessage="System" />,
        icon: <Wrench />,
        items: [
            {
                type: "route",
                primary: <FormattedMessage id="menu.publisher" defaultMessage="Publisher" />,
                route: {
                    path: "/system/publisher",
                    component: PublisherPage,
                },
                requiredPermission: "builds",
            },
            {
                type: "route",
                primary: <FormattedMessage id="menu.cronJobs" defaultMessage="Cron Jobs" />,
                route: {
                    path: "/system/cron-jobs",
                    component: CronJobsPage,
                },
                requiredPermission: "cronJobs",
            },
            {
                type: "route",
                primary: <FormattedMessage id="menu.warnings" defaultMessage="Warnings" />,
                route: {
                    path: "/system/warnings",
                    component: WarningsPage,
                },
                requiredPermission: "warnings",
            },
        ],
    },
    {
        type: "route",
        primary: <FormattedMessage id="menu.userPermissions" defaultMessage="User Permissions" />,
        icon: <Snips />,
        route: {
            path: "/user-permissions",
            component: UserPermissionsPage,
        },
        requiredPermission: ["userPermissions", "impersonation"],
    },
    {
        type: "group",
        title: <FormattedMessage id="menu.products" defaultMessage="Products" />,
        items: [
            {
                type: "collapsible",
                primary: <FormattedMessage id="menu.generator" defaultMessage="Generator" />,
                icon: <Snips />,
                items: [
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.products" defaultMessage="Products" />,
                        route: {
                            path: "/products",
                            component: ProductsPage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.createCapProduct" defaultMessage="Create Cap Product" />,
                        route: {
                            path: "/create-cap-product",
                            component: CreateCapProductPage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.manufacturers" defaultMessage="Manufacturers" />,
                        route: {
                            path: "/manufacturers",
                            component: ManufacturersPage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productsWithLowPrice" defaultMessage="Products with low price" />,
                        route: {
                            path: "/products-with-low-price",
                            component: ProductsWithLowPricePage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productCategories" defaultMessage="Product Categories" />,
                        route: {
                            path: "/product-categories",
                            component: ProductCategoriesPage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productTags" defaultMessage="Product Tags" />,
                        route: {
                            path: "/product-tags",
                            component: ProductTagsPage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productHighlights" defaultMessage="Product Highlights" />,
                        route: {
                            path: "/product-highlights",
                            component: ProductHighlightsPage,
                        },
                    },
                ],
            },
            {
                type: "collapsible",
                primary: <FormattedMessage id="menu.handmade" defaultMessage="Handmade" />,
                icon: <Snips />,
                items: [
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productsHandmade" defaultMessage="Products Handmade" />,
                        route: {
                            path: "/products-handmade",
                            component: ProductsHandmadePage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.manufacturersHandmade" defaultMessage="Manufacturers Handmade" />,
                        route: {
                            path: "/manufacturers-handmade",
                            component: ManufacturersHandmadePage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productCategoriesHandmade" defaultMessage="Product Categories Handmade" />,
                        route: {
                            path: "/product-categories-handmade",
                            component: ProductCategoriesHandmadePage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productTagsHandmade" defaultMessage="Product Tags Handmade" />,
                        route: {
                            path: "/product-tags-handmade",
                            component: ProductTagsHandmadePage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productHighlights" defaultMessage="Product Highlights Handmade" />,
                        route: {
                            path: "/product-highlights-handmade",
                            component: ProductHighlightsHandmadePage,
                        },
                    },
                ],
            },
        ],
        requiredPermission: "products",
    },
];

export const AppMasterMenu = () => <MasterMenu menu={masterMenuData} />;
