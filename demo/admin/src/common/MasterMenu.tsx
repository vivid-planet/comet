import { Assets, Dashboard, PageTree, Snips, Wrench } from "@comet/admin-icons";
import {
    AllCategories,
    ContentScopeIndicator,
    createRedirectsPage,
    DamPage,
    DocumentInterface,
    MasterMenu,
    MasterMenuData,
    PagesPage,
    PublisherPage,
    UserPermissionsPage,
} from "@comet/cms-admin";
import { ImportFromPicsum } from "@src/dam/ImportFromPicsum";
import { DashboardPage } from "@src/dashboard/DashboardPage";
import { Link } from "@src/documents/links/Link";
import { Page } from "@src/documents/pages/Page";
import { EditFooterPage } from "@src/footer/EditFooterPage";
import { FormattedMessage } from "react-intl";

export const pageTreeCategories: AllCategories = [
    {
        category: "MainNavigation",
        label: <FormattedMessage id="menu.pageTree.mainNavigation" defaultMessage="Main navigation" />,
    },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pageTreeDocumentTypes: Record<string, DocumentInterface<any, any>> = {
    Page,
    Link,
};
const RedirectsPage = createRedirectsPage({ scopeParts: ["domain"] });

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
        type: "route",
        primary: <FormattedMessage id="menu.pageTree" defaultMessage="Page tree" />,
        icon: <PageTree />,
        route: {
            path: "/pages/pagetree/main-navigation",
            render: () => (
                <PagesPage
                    path="/pages/pagetree/main-navigation"
                    allCategories={pageTreeCategories}
                    documentTypes={pageTreeDocumentTypes}
                    category="MainNavigation"
                    renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} />}
                />
            ),
        },
        requiredPermission: "pageTree",
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
];

export const AppMasterMenu = () => <MasterMenu menu={masterMenuData} />;
