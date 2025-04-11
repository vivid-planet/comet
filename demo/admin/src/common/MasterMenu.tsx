import { Assets, Dashboard, Data, PageTree, Snips, Wrench } from "@comet/admin-icons";
import {
    ContentScopeIndicator,
    CronJobsPage,
    DamPage,
    type DocumentInterface,
    type DocumentType,
    MasterMenu,
    type MasterMenuData,
    PagesPage,
    PublisherPage,
    UserPermissionsPage,
    WarningsPage,
} from "@comet/cms-admin";
import { ImportFromPicsum } from "@src/dam/ImportFromPicsum";
import { DashboardPage } from "@src/dashboard/DashboardPage";
import { Link } from "@src/documents/links/Link";
import { Page } from "@src/documents/pages/Page";
import { PredefinedPage } from "@src/documents/predefinedPages/PredefinedPage";
import { EditFooterPage } from "@src/footer/EditFooterPage";
import { type GQLPageTreeNodeCategory } from "@src/graphql.generated";
import MainMenu from "@src/mainMenu/MainMenu";
import { NewsPage } from "@src/news/NewsPage";
import { categoryToUrlParam, pageTreeCategories, urlParamToCategory } from "@src/pageTree/pageTreeCategories";
import ProductCategoriesPage from "@src/products/categories/ProductCategoriesPage";
import { CombinationFieldsTestProductsPage } from "@src/products/future/CombinationFieldsTestProductsPage";
import { CreateCapProductPage as FutureCreateCapProductPage } from "@src/products/future/CreateCapProductPage";
import { ManufacturersPage as FutureManufacturersPage } from "@src/products/future/ManufacturersPage";
import { ProductsPage as FutureProductsPage, ProductsPage } from "@src/products/future/ProductsPage";
import { ProductsWithLowPricePage as FutureProductsWithLowPricePage } from "@src/products/future/ProductsWithLowPricePage";
import { ManufacturersPage as ManufacturersHandmadePage } from "@src/products/ManufacturersPage";
import ProductsHandmadePage from "@src/products/ProductsPage";
import ProductTagsPage from "@src/products/tags/ProductTagsPage";
import { RedirectsPage } from "@src/redirects/RedirectsPage";
import { type ContentScope } from "@src/site-configs";
import { FormattedMessage } from "react-intl";
import { Redirect, type RouteComponentProps } from "react-router";

import { ComponentDemo } from "./ComponentDemo";
import { EditPageNode } from "./EditPageNode";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pageTreeDocumentTypes: Record<string, DocumentInterface<any, any>> = {
    Page,
    Link,
};

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
        primary: <FormattedMessage id="menu.pageTree" defaultMessage="Page tree" />,
        icon: <PageTree />,
        items: pageTreeCategories.map((category) => ({
            type: "route",
            primary: category.label,
            to: `/pages/pagetree/${categoryToUrlParam(category.category as GQLPageTreeNodeCategory)}`,
        })),
        route: {
            path: "/pages/pagetree/:category",
            render: ({ match }: RouteComponentProps<{ category: string }>) => {
                const category = urlParamToCategory(match.params.category);

                if (category === undefined) {
                    return <Redirect to={`${match.url}/dashboard`} />;
                }

                return (
                    <PagesPage
                        allCategories={pageTreeCategories}
                        documentTypes={(category): Record<DocumentType, DocumentInterface> => {
                            if (category === "TopMenu") {
                                return {
                                    Page,
                                    PredefinedPage,
                                };
                            }

                            return {
                                Page,
                                PredefinedPage,
                                Link,
                            };
                        }}
                        editPageNode={EditPageNode}
                        category={category}
                        renderContentScopeIndicator={(scope: ContentScope) => <ContentScopeIndicator scope={scope} />}
                    />
                );
            },
        },
        requiredPermission: "pageTree",
    },
    {
        type: "collapsible",
        primary: <FormattedMessage id="menu.structuredContent" defaultMessage="Structured Content" />,
        icon: <Data />,
        items: [
            {
                type: "route",
                primary: <FormattedMessage id="menu.news" defaultMessage="News" />,
                route: {
                    path: "/structured-content/news",
                    component: NewsPage,
                },
            },
        ],
        requiredPermission: "news",
    },
    {
        type: "route",
        primary: <FormattedMessage id="menu.dam" defaultMessage="Assets" />,
        icon: <Assets />,
        route: {
            path: "/assets",
            render: () => <DamPage additionalToolbarItems={<ImportFromPicsum />} />,
        },
        requiredPermission: "dam",
    },
    {
        type: "collapsible",
        primary: <FormattedMessage id="menu.project-snips" defaultMessage="Project Snips" />,
        icon: <Snips />,
        items: [
            {
                type: "route",
                primary: <FormattedMessage id="menu.project-snips.mainMenu" defaultMessage="Main menu" />,
                route: {
                    path: "/project-snips/main-menu",
                    component: MainMenu,
                },
                requiredPermission: "pageTree",
            },
            {
                type: "route",
                primary: <FormattedMessage id="menu.project-snips.footer" defaultMessage="Footer" />,
                route: {
                    path: "/project-snips/footer",
                    component: EditFooterPage,
                },
                requiredPermission: "pageTree",
            },
        ],
        requiredPermission: "pageTree",
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
                primary: <FormattedMessage id="menu.redirects" defaultMessage="Redirects" />,
                route: {
                    path: "/system/redirects",
                    component: RedirectsPage,
                },
                requiredPermission: "pageTree",
            },
            {
                type: "route",
                primary: <FormattedMessage id="menu.warnings" defaultMessage="Warnings" />,
                route: {
                    path: "/system/warnings",
                    component: WarningsPage,
                },
                requiredPermission: "pageTree",
            },
        ],
    },
    {
        type: "route",
        primary: <FormattedMessage id="menu.componentDemo" defaultMessage="Component demo" />,
        icon: <Snips />,
        route: {
            path: "/component-demo",
            component: ComponentDemo,
        },
        requiredPermission: "pageTree",
    },
    {
        type: "route",
        primary: <FormattedMessage id="menu.userPermissions" defaultMessage="User Permissions" />,
        icon: <Snips />,
        route: {
            path: "/user-permissions",
            component: UserPermissionsPage,
        },
        requiredPermission: "userPermissions",
    },
    {
        type: "group",
        title: <FormattedMessage id="menu.products" defaultMessage="Products" />,
        items: [
            {
                type: "collapsible",
                primary: <FormattedMessage id="menu.futureGenerator" defaultMessage="Future Generator" />,
                icon: <Snips />,
                items: [
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productsFuture" defaultMessage="Products Future" />,
                        route: {
                            path: "/products-future",
                            component: FutureProductsPage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.createCapProductFuture" defaultMessage="Create Cap Product Future" />,
                        route: {
                            path: "/create-cap-product-future",
                            component: FutureCreateCapProductPage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.manufacturersFuture" defaultMessage="Manufacturers Future" />,
                        route: {
                            path: "/manufacturers-future",
                            component: FutureManufacturersPage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productsFuture" defaultMessage="Products with low price Future" />,
                        route: {
                            path: "/products-with-low-price-future",
                            component: FutureProductsWithLowPricePage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.combinationFieldsTest" defaultMessage="Combination Fields Test" />,
                        secondary: <FormattedMessage id="menu.productsFuture" defaultMessage="Products Future" />,
                        route: {
                            path: "/combination-fields-test-products-future",
                            component: CombinationFieldsTestProductsPage,
                        },
                    },
                ],
            },
            {
                type: "collapsible",
                primary: <FormattedMessage id="menu.oldGenerator" defaultMessage="Old Generator" />,
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
                        primary: <FormattedMessage id="menu.productCategories" defaultMessage="Categories" />,
                        route: {
                            path: "/product-categories",
                            component: ProductCategoriesPage,
                        },
                    },
                    {
                        type: "route",
                        primary: <FormattedMessage id="menu.productTags" defaultMessage="Tags" />,
                        route: {
                            path: "/product-tags",
                            component: ProductTagsPage,
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
                ],
            },
        ],
        requiredPermission: "products",
    },
];

export const AppMasterMenu = () => <MasterMenu menu={masterMenuData} />;
