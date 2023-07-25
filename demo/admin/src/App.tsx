import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "material-design-icons/iconfont/material-icons.css";
import "typeface-open-sans";

import { ApolloProvider } from "@apollo/client";
import { ErrorDialogHandler, MasterLayout, MuiThemeProvider, RouterBrowserRouter, RouteWithErrorBoundary, SnackbarProvider } from "@comet/admin";
import {
    AllCategories,
    CmsBlockContextProvider,
    createHttpClient,
    createRedirectsPage,
    CronJobsPage,
    DamConfigProvider,
    DamPage,
    LocaleProvider,
    PagesPage,
    PublisherPage,
    SiteConfig,
    SitePreview,
    SitesConfigProvider,
} from "@comet/cms-admin";
import { DamScopeProvider } from "@comet/cms-admin/lib/dam/config/DamScopeProvider";
import { css, Global } from "@emotion/react";
import { createApolloClient } from "@src/common/apollo/createApolloClient";
import ContentScopeProvider, { ContentScope } from "@src/common/ContentScopeProvider";
import { additionalPageTreeNodeFieldsFragment, EditPageNode } from "@src/common/EditPageNode";
import MasterHeader from "@src/common/MasterHeader";
import MasterMenu from "@src/common/MasterMenu";
import { createConfig } from "@src/config";
import Dashboard from "@src/dashboard/Dashboard";
import { PredefinedPage } from "@src/predefinedPage/PredefinedPage";
import theme from "@src/theme";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Redirect, Route, Switch } from "react-router-dom";

import { ComponentDemo } from "./common/ComponentDemo";
import { ContentScopeIndicator } from "./common/ContentScopeIndicator";
import { getMessages } from "./lang";
import { Link } from "./links/Link";
import { NewsLinkBlock } from "./news/blocks/NewsLinkBlock";
import News from "./news/News";
import MainMenu from "./pages/mainMenu/MainMenu";
import { Page } from "./pages/Page";
import ProductCategoriesPage from "./products/categories/ProductCategoriesPage";
import ProductsPage from "./products/ProductsPage";
import ProductTagsPage from "./products/tags/ProductTagsPage";
import { urlParamToCategory } from "./utils/pageTreeNodeCategoryMapping";

const GlobalStyle = () => (
    <Global
        styles={css`
            body {
                margin: 0;
            }
        `}
    />
);

const config = createConfig();
const apolloClient = createApolloClient(config.apiUrl);
const apiClient = createHttpClient(config.apiUrl);

const categories: AllCategories = [
    {
        category: "MainNavigation",
        label: <FormattedMessage id="menu.pageTree.mainNavigation" defaultMessage="Main navigation" />,
    },
    {
        category: "TopMenu",
        label: <FormattedMessage id="menu.pageTree.topMenu" defaultMessage="Top menu" />,
    },
];

const pageTreeDocumentTypes = {
    Page,
    Link,
    PredefinedPage,
};

const RedirectsPage = createRedirectsPage({ customTargets: { news: NewsLinkBlock }, scopeParts: ["domain"] });

class App extends React.Component {
    public static render(baseEl: Element): void {
        ReactDOM.render(<App />, baseEl);
    }

    public render(): JSX.Element {
        return (
            <ApolloProvider client={apolloClient}>
                <SitesConfigProvider
                    value={{
                        configs: config.sitesConfig,
                        resolveSiteConfigForScope: (configs: Record<string, SiteConfig>, scope: ContentScope) => configs[scope.domain],
                    }}
                >
                    <DamConfigProvider value={{ scopeParts: ["domain"] }}>
                        <IntlProvider locale="en" messages={getMessages()}>
                            <LocaleProvider resolveLocaleForScope={(scope: ContentScope) => scope.domain}>
                                <MuiThemeProvider theme={theme}>
                                    <RouterBrowserRouter>
                                        <DndProvider backend={HTML5Backend}>
                                            <SnackbarProvider>
                                                <CmsBlockContextProvider
                                                    damConfig={{
                                                        apiUrl: config.apiUrl,
                                                        apiClient,
                                                        maxFileSize: config.dam.uploadsMaxFileSize,
                                                        maxSrcResolution: config.imgproxy.maxSrcResolution,
                                                        allowedImageAspectRatios: config.dam.allowedImageAspectRatios,
                                                    }}
                                                    pageTreeCategories={categories}
                                                    pageTreeDocumentTypes={pageTreeDocumentTypes}
                                                    additionalPageTreeNodeFragment={additionalPageTreeNodeFieldsFragment}
                                                >
                                                    <React.Fragment>
                                                        <GlobalStyle />
                                                        <ContentScopeProvider>
                                                            {({ match }) => (
                                                                <Switch>
                                                                    {/* @TODO: add preview to contentScope once site is capable of contentScope */}
                                                                    <Route
                                                                        path={`${match.path}/preview`}
                                                                        render={(props) => <SitePreview {...props} />}
                                                                    />
                                                                    <Route
                                                                        render={(props) => (
                                                                            <MasterLayout headerComponent={MasterHeader} menuComponent={MasterMenu}>
                                                                                <Switch>
                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/dashboard`}
                                                                                        component={Dashboard}
                                                                                    />
                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/project-snips/main-menu`}
                                                                                        component={MainMenu}
                                                                                    />
                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/pages/pagetree/:category`}
                                                                                        render={({ match: { params } }) => {
                                                                                            const category = urlParamToCategory(params.category);

                                                                                            if (category === undefined) {
                                                                                                return <Redirect to={`${match.url}/dashboard`} />;
                                                                                            }

                                                                                            return (
                                                                                                <DamScopeProvider>
                                                                                                    <PagesPage
                                                                                                        path={`/pages/pagetree/${params.category}`}
                                                                                                        allCategories={categories}
                                                                                                        documentTypes={pageTreeDocumentTypes}
                                                                                                        editPageNode={EditPageNode}
                                                                                                        category={category}
                                                                                                        renderContentScopeIndicator={(scope) => (
                                                                                                            <ContentScopeIndicator
                                                                                                                scope={scope}
                                                                                                                variant="toolbar"
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                </DamScopeProvider>
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/structured-content/news`}
                                                                                        component={News}
                                                                                    />
                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/assets`}
                                                                                        render={() => (
                                                                                            <DamPage
                                                                                                renderContentScopeIndicator={(scope) => (
                                                                                                    <ContentScopeIndicator
                                                                                                        scope={scope}
                                                                                                        domainOnly
                                                                                                        variant="toolbar"
                                                                                                    />
                                                                                                )}
                                                                                            />
                                                                                        )}
                                                                                    />

                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/system/cron-jobs`}
                                                                                        component={CronJobsPage}
                                                                                    />
                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/system/publisher`}
                                                                                        component={PublisherPage}
                                                                                    />

                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/system/redirects`}
                                                                                        render={() => (
                                                                                            <RedirectsPage redirectPathAfterChange="/system/redirects" />
                                                                                        )}
                                                                                    />

                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/component-demo`}
                                                                                        component={ComponentDemo}
                                                                                    />

                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/products`}
                                                                                        component={ProductsPage}
                                                                                    />
                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/product-categories`}
                                                                                        component={ProductCategoriesPage}
                                                                                    />
                                                                                    <RouteWithErrorBoundary
                                                                                        path={`${match.path}/product-tags`}
                                                                                        component={ProductTagsPage}
                                                                                    />

                                                                                    <Redirect from={`${match.path}`} to={`${match.url}/dashboard`} />
                                                                                </Switch>
                                                                            </MasterLayout>
                                                                        )}
                                                                    />
                                                                </Switch>
                                                            )}
                                                        </ContentScopeProvider>
                                                        <ErrorDialogHandler />
                                                    </React.Fragment>
                                                </CmsBlockContextProvider>
                                            </SnackbarProvider>
                                        </DndProvider>
                                    </RouterBrowserRouter>
                                </MuiThemeProvider>
                            </LocaleProvider>
                        </IntlProvider>
                    </DamConfigProvider>
                </SitesConfigProvider>
            </ApolloProvider>
        );
    }
}
export default App;
