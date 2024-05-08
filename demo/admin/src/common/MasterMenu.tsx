import { Assets, Dashboard as DashboardIcon, Data, PageTree, Snips, Wrench } from "@comet/admin-icons";
import {
    createRedirectsPage,
    CronJobsPage,
    DamPage,
    MasterMenu as CometMasterMenu,
    MasterMenuData,
    PagesPage,
    PublisherPage,
    UserPermissionsPage,
} from "@comet/cms-admin";
import { ImportFromUnsplash } from "@src/dam/ImportFromUnsplash";
import Dashboard from "@src/dashboard/Dashboard";
import { GQLPageTreeNodeCategory } from "@src/graphql.generated";
import { Link } from "@src/links/Link";
import { NewsLinkBlock } from "@src/news/blocks/NewsLinkBlock";
import { NewsPage } from "@src/news/generated/NewsPage";
import MainMenu from "@src/pages/mainMenu/MainMenu";
import { Page } from "@src/pages/Page";
import { categoryToUrlParam, pageTreeCategories, urlParamToCategory } from "@src/pageTree/pageTreeCategories";
import { PredefinedPage } from "@src/predefinedPage/PredefinedPage";
import ProductCategoriesPage from "@src/products/categories/ProductCategoriesPage";
import { CreateProductPage as FutureCreateProductPage } from "@src/products/future/CreateProductPage";
import { ManufacturersPage as FutureManufacturersPage } from "@src/products/future/ManufacturersPage";
import { ProductsPage as FutureProductsPage } from "@src/products/future/ProductsPage";
import { ProductsWithLowPricePage as FutureProductsWithLowPricePage } from "@src/products/future/ProductsWithLowPricePage";
import { ProductsPage } from "@src/products/generated/ProductsPage";
import { ManufacturersPage as ManufacturersHandmadePage } from "@src/products/ManufacturersPage";
import ProductsHandmadePage from "@src/products/ProductsPage";
import ProductTagsPage from "@src/products/tags/ProductTagsPage";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Redirect, RouteComponentProps } from "react-router-dom";

import { ComponentDemo } from "./ComponentDemo";
import { ContentScopeIndicator } from "./ContentScopeIndicator";
import { EditPageNode } from "./EditPageNode";

export const pageTreeDocumentTypes = {
    Page,
    Link,
    PredefinedPage,
};

const RedirectsPage = createRedirectsPage({ customTargets: { news: NewsLinkBlock }, scopeParts: ["domain"] });

export const masterMenuData: MasterMenuData = [
    {
        primary: <FormattedMessage id="menu.dashboard" defaultMessage="Dashboard" />,
        icon: <DashboardIcon />,
        route: {
            path: "/dashboard",
            component: Dashboard,
        },
    },
    {
        primary: <FormattedMessage id="menu.pageTree" defaultMessage="Page tree" />,
        icon: <PageTree />,
        submenu: pageTreeCategories.map((category) => ({
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
                        path={`/pages/pagetree/${match.params.category}`}
                        allCategories={pageTreeCategories}
                        documentTypes={pageTreeDocumentTypes}
                        editPageNode={EditPageNode}
                        category={category}
                        renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} variant="toolbar" />}
                    />
                );
            },
        },
        requiredPermission: "pageTree",
    },
    {
        primary: <FormattedMessage id="menu.structuredContent" defaultMessage="Structured Content" />,
        icon: <Data />,
        submenu: [
            {
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
        primary: <FormattedMessage id="menu.dam" defaultMessage="Assets" />,
        icon: <Assets />,
        route: {
            path: "/assets",
            render: () => (
                <DamPage
                    renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} domainOnly variant="toolbar" />}
                    additionalToolbarItems={<ImportFromUnsplash />}
                />
            ),
        },
        requiredPermission: "dam",
    },
    {
        primary: <FormattedMessage id="menu.projectSnips" defaultMessage="Project snips" />,
        icon: <Snips />,
        submenu: [
            {
                primary: <FormattedMessage id="menu.mainMenu" defaultMessage="Main menu" />,
                route: {
                    path: "/project-snips/main-menu",
                    component: MainMenu,
                },
            },
        ],
        requiredPermission: "pageTree",
    },
    {
        primary: <FormattedMessage id="menu.system" defaultMessage="System" />,
        icon: <Wrench />,
        submenu: [
            {
                primary: <FormattedMessage id="menu.publisher" defaultMessage="Publisher" />,
                route: {
                    path: "/system/publisher",
                    component: PublisherPage,
                },
                requiredPermission: "builds",
            },
            {
                primary: <FormattedMessage id="menu.cronJobs" defaultMessage="Cron Jobs" />,
                route: {
                    path: "/system/cron-jobs",
                    component: CronJobsPage,
                },
                requiredPermission: "cronJobs",
            },
            {
                primary: <FormattedMessage id="menu.redirects" defaultMessage="Redirects" />,
                route: {
                    path: "/system/redirects",
                    render: () => <RedirectsPage redirectPathAfterChange="/system/redirects" />,
                },
                requiredPermission: "pageTree",
            },
        ],
        requiredPermission: "pageTree",
    },
    {
        primary: <FormattedMessage id="menu.componentDemo" defaultMessage="Component demo" />,
        icon: <Snips />,
        route: {
            path: "/component-demo",
            component: ComponentDemo,
        },
        requiredPermission: "pageTree",
    },
    {
        primary: <FormattedMessage id="menu.products" defaultMessage="Products" />,
        icon: <Snips />,
        submenu: [
            {
                primary: <FormattedMessage id="menu.productsFuture" defaultMessage="Products Future" />,
                route: {
                    path: "/products-future",
                    component: FutureProductsPage,
                },
            },
            {
                primary: <FormattedMessage id="menu.createProductFuture" defaultMessage="Create Product Future" />,
                route: {
                    path: "/create-product-future",
                    component: FutureCreateProductPage,
                },
            },
            {
                primary: <FormattedMessage id="menu.manufacturersFuture" defaultMessage="Manufacturers Future" />,
                route: {
                    path: "/manufacturers-future",
                    component: FutureManufacturersPage,
                },
            },
            {
                primary: <FormattedMessage id="menu.productsFuture" defaultMessage="Products with low price Future" />,
                route: {
                    path: "/products-with-low-price-future",
                    component: FutureProductsWithLowPricePage,
                },
            },
            {
                primary: <FormattedMessage id="menu.products" defaultMessage="Products" />,
                route: {
                    path: "/products",
                    component: ProductsPage,
                },
            },
            {
                primary: <FormattedMessage id="menu.productCategories" defaultMessage="Categories" />,
                route: {
                    path: "/product-categories",
                    component: ProductCategoriesPage,
                },
            },
            {
                primary: <FormattedMessage id="menu.productTags" defaultMessage="Tags" />,
                route: {
                    path: "/product-tags",
                    component: ProductTagsPage,
                },
            },
            {
                primary: <FormattedMessage id="menu.productsHandmade" defaultMessage="Products Handmade" />,
                route: {
                    path: "/products-handmade",
                    component: ProductsHandmadePage,
                },
            },
            {
                primary: <FormattedMessage id="menu.manufacturersHandmade" defaultMessage="Manufacturers Handmade" />,
                route: {
                    path: "/manufacturers-handmade",
                    component: ManufacturersHandmadePage,
                },
            },
        ],
        requiredPermission: "products",
    },
    {
        primary: <FormattedMessage id="menu.userPermissions" defaultMessage="User Permissions" />,
        icon: <Snips />,
        route: {
            path: "/user-permissions",
            component: UserPermissionsPage,
        },
        requiredPermission: "userPermissions",
    },
];

const MasterMenu = () => <CometMasterMenu menu={masterMenuData} />;
export default MasterMenu;
