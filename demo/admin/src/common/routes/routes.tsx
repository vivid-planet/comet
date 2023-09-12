import { Assets, Dashboard as DashboardIcon, Data, PageTree, Snips, Wrench } from "@comet/admin-icons";
import {
    AllCategories,
    createRedirectsPage,
    CronJobsPage,
    DamPage,
    PagesPage,
    PublisherPage,
    RouteMenu,
    UserPermissionsPage,
} from "@comet/cms-admin";
import Dashboard from "@src/dashboard/Dashboard";
import { GQLPageTreeNodeCategory } from "@src/graphql.generated";
import { Link } from "@src/links/Link";
import { NewsLinkBlock } from "@src/news/blocks/NewsLinkBlock";
import News from "@src/news/News";
import MainMenu from "@src/pages/mainMenu/MainMenu";
import { Page } from "@src/pages/Page";
import { PredefinedPage } from "@src/predefinedPage/PredefinedPage";
import ProductCategoriesPage from "@src/products/categories/ProductCategoriesPage";
import ProductsPage from "@src/products/ProductsPage";
import ProductTagsPage from "@src/products/tags/ProductTagsPage";
import { categoryToUrlParam, urlParamToCategory } from "@src/utils/pageTreeNodeCategoryMapping";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Redirect } from "react-router";

import { ComponentDemo } from "../ComponentDemo";
import { ContentScopeIndicator } from "../ContentScopeIndicator";
import { EditPageNode } from "../EditPageNode";
import ProductsHandmadePage from "./products/ProductsPage";

export const pageTreeCategories: AllCategories = [
    {
        category: "MainNavigation",
        label: <FormattedMessage id="menu.pageTree.mainNavigation" defaultMessage="Main navigation" />,
    },
    {
        category: "TopMenu",
        label: <FormattedMessage id="menu.pageTree.topMenu" defaultMessage="Top menu" />,
    },
];

export const pageTreeDocumentTypes = {
    Page,
    Link,
    PredefinedPage,
};

const RedirectsPage = createRedirectsPage({ customTargets: { news: NewsLinkBlock }, scopeParts: ["domain"] });

export const routeMenu: RouteMenu = [
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
        subMenu: pageTreeCategories.map((category) => ({
            primary: category.label,
            to: `/pages/pagetree/${categoryToUrlParam(category.category as GQLPageTreeNodeCategory)}`,
        })),
        route: {
            path: "/pages/pagetree/:category",
            render: ({ match }) => {
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
    },
    {
        primary: <FormattedMessage id="menu.structuredContent" defaultMessage="Structured Content" />,
        icon: <Data />,
        subMenu: [
            {
                primary: <FormattedMessage id="menu.news" defaultMessage="News" />,
                route: {
                    path: "/structured-content/news",
                    component: News,
                },
            },
        ],
    },
    {
        primary: <FormattedMessage id="menu.dam" defaultMessage="Assets" />,
        icon: <Assets />,
        route: {
            path: "/assets",
            render: () => <DamPage renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} domainOnly variant="toolbar" />} />,
        },
    },
    {
        primary: <FormattedMessage id="menu.projectSnips" defaultMessage="Project snips" />,
        icon: <Snips />,
        subMenu: [
            {
                primary: <FormattedMessage id="menu.mainMenu" defaultMessage="Main menu" />,
                route: {
                    path: "/project-snips/main-menu",
                    component: MainMenu,
                },
            },
        ],
    },
    {
        primary: <FormattedMessage id="menu.system" defaultMessage="System" />,
        icon: <Wrench />,
        subMenu: [
            {
                primary: <FormattedMessage id="menu.publisher" defaultMessage="Publisher" />,
                route: {
                    path: "/system/publisher",
                    component: PublisherPage,
                },
            },
            {
                primary: <FormattedMessage id="menu.cronJobs" defaultMessage="Cron Jobs" />,
                route: {
                    path: "/system/cron-jobs",
                    component: CronJobsPage,
                },
            },
            {
                primary: <FormattedMessage id="menu.redirects" defaultMessage="Redirects" />,
                route: {
                    path: "/system/redirects",
                    render: () => <RedirectsPage redirectPathAfterChange="/system/redirects" />,
                },
            },
        ],
    },
    {
        primary: <FormattedMessage id="menu.componentDemo" defaultMessage="Component demo" />,
        icon: <Snips />,
        route: {
            path: "/component-demo",
            component: ComponentDemo,
        },
    },
    {
        primary: <FormattedMessage id="menu.products" defaultMessage="Products" />,
        icon: <Snips />,
        subMenu: [
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
        ],
    },
    {
        primary: <FormattedMessage id="menu.userPermissions" defaultMessage="User Permissions" />,
        icon: <Snips />,
        route: {
            path: "/user-permissions",
            component: UserPermissionsPage,
        },
    },
];
