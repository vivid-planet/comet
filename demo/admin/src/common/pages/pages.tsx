import { Assets, Dashboard as DashboardIcon, Data, PageTree, Snips, Wrench } from "@comet/admin-icons";
import { AllCategories, createRedirectsPage, CronJobsPage, DamPage, PagesPage, PublisherPage, UserPermissionsPage } from "@comet/cms-admin";
import { Person } from "@mui/icons-material";
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
import { Pages } from "./page.type";

const RedirectsPage = createRedirectsPage({ customTargets: { news: NewsLinkBlock }, scopeParts: ["domain"] });
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

export const pages: Pages = [
    {
        route: {
            path: "/dashboard",
            component: Dashboard,
        },
        menu: {
            primary: <FormattedMessage id="menu.dashboard" defaultMessage="Dashboard" />,
            icon: <DashboardIcon />,
        },
    },
    {
        routes: [
            {
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
        ],
        menu: {
            primary: <FormattedMessage id="menu.pageTree" defaultMessage="Page tree" />,
            icon: <PageTree />,
            subMenu: pageTreeCategories.map((category) => ({
                primary: category.label,
                to: `/pages/pagetree/${categoryToUrlParam(category.category as GQLPageTreeNodeCategory)}`,
            })),
        },
        requiredPermission: "pageTree",
    },
    {
        route: {
            path: "/structured-content/news",
            component: News,
        },
        menu: {
            primary: <FormattedMessage id="menu.structuredContent" defaultMessage="Structured Content" />,
            icon: <Data />,
            subMenu: [
                {
                    primary: <FormattedMessage id="menu.news" defaultMessage="News" />,
                    to: "/structured-content/news",
                },
            ],
        },
        requiredPermission: "news",
    },
    {
        route: {
            path: "/assets",
            render: () => <DamPage renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} domainOnly variant="toolbar" />} />,
        },
        menu: {
            primary: <FormattedMessage id="menu.dam" defaultMessage="Assets" />,
            icon: <Assets />,
        },
        requiredPermission: "pageTree",
    },
    {
        route: {
            path: "/project-snips/main-menu",
            component: MainMenu,
        },
        menu: {
            primary: <FormattedMessage id="menu.projectSnips" defaultMessage="Project snips" />,
            icon: <Snips />,
            subMenu: [
                {
                    primary: <FormattedMessage id="menu.mainMenu" defaultMessage="Main menu" />,
                    to: "/project-snips/main-menu",
                },
            ],
        },
        requiredPermission: "pageTree",
    },
    {
        routes: [
            {
                path: "/system/publisher",
                component: PublisherPage,
            },
            {
                path: "/system/redirects",
                render: () => <RedirectsPage redirectPathAfterChange="/system/redirects" />,
            },
            {
                path: "/system/cron-jobs",
                component: CronJobsPage,
            },
        ],
        menu: {
            primary: <FormattedMessage id="menu.system" defaultMessage="System" />,
            icon: <Wrench />,
            subMenu: [
                {
                    primary: <FormattedMessage id="menu.publisher" defaultMessage="Publisher" />,
                    to: "/system/publisher",
                },
                {
                    primary: <FormattedMessage id="menu.cronJobs" defaultMessage="Cron Jobs" />,
                    to: "/system/cron-jobs",
                },
                {
                    primary: <FormattedMessage id="menu.redirects" defaultMessage="Redirects" />,
                    to: "/system/redirects",
                },
            ],
        },
        requiredPermission: "pageTree",
    },
    {
        route: {
            path: "/component-demo",
            component: ComponentDemo,
        },
        menu: {
            primary: <FormattedMessage id="menu.componentDemo" defaultMessage="Component demo" />,
            icon: <Snips />,
        },
        requiredPermission: "pageTree",
    },
    {
        routes: [
            {
                path: "/products",
                component: ProductsPage,
            },
            {
                path: "/product-categories",
                component: ProductCategoriesPage,
            },
            {
                path: "/product-tags",
                component: ProductTagsPage,
            },
        ],
        menu: {
            primary: <FormattedMessage id="menu.products" defaultMessage="Products" />,
            icon: <Snips />,
            subMenu: [
                {
                    primary: <FormattedMessage id="menu.products" defaultMessage="Products" />,
                    to: "/products",
                },
                {
                    primary: <FormattedMessage id="menu.productCategories" defaultMessage="Categories" />,
                    to: "/product-categories",
                },
                {
                    primary: <FormattedMessage id="menu.productTags" defaultMessage="Tags" />,
                    to: "/product-tags",
                },
            ],
        },
        requiredPermission: "products",
    },
    {
        route: {
            path: "/user-permissions",
            component: UserPermissionsPage,
        },
        menu: {
            primary: <FormattedMessage id="menu.userPermissions" defaultMessage="User Permissions" />,
            icon: <Person />,
        },
        requiredPermission: "userPermissions",
    },
];
