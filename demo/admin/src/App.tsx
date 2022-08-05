import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "material-design-icons/iconfont/material-icons.css";
import "typeface-open-sans";

import { ApolloProvider } from "@apollo/client";
import { ErrorDialogHandler, MasterLayout, MuiThemeProvider, RouterBrowserRouter, RouteWithErrorBoundary, SnackbarProvider } from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import {
    AllCategories,
    AuthorizationErrorPage,
    BuildInformationProvider,
    CmsBlockContextProvider,
    ContentScopeIndicator,
    createHttpClient,
    createRedirectsPage,
    DamConfigProvider,
    DamPage,
    LocaleProvider,
    PagesPage,
    Publisher,
    SiteConfig,
    SitePreview,
    SitesConfigProvider,
} from "@comet/cms-admin";
import { AuthConfiguration, AuthorizationGate, AuthorizationProvider, createAuthorizationManager, createRefreshHandler } from "@comet/react-app-auth";
import { css, Global } from "@emotion/react";
import { createApolloClient } from "@src/common/apollo/createApolloClient";
import { ScopeIndicatorContent, ScopeIndicatorLabel, ScopeIndicatorLabelBold } from "@src/common/ContentScopeIndicatorStyles";
import ContentScopeProvider, { ContentScope } from "@src/common/ContentScopeProvider";
import { EditPageNode } from "@src/common/EditPageNode";
import MasterHeader from "@src/common/MasterHeader";
import MasterMenu from "@src/common/MasterMenu";
import config from "@src/config";
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
import { getMessages } from "./lang";
import { Link } from "./links/Link";
import { NewsLinkBlock } from "./news/blocks/NewsLinkBlock";
import News from "./news/News";
import MainMenu from "./pages/mainMenu/MainMenu";
import { Page } from "./pages/Page";
import Products from "./products/Products";
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

const authorizationConfig: AuthConfiguration = {
    issuer: config.IDP_URL,
    clientId: config.IDP_CLIENT_ID,
    redirectUrl: `${config.ADMIN_URL}/process-token`,
    responseType: "code",
    scope: "offline openid profile email role",
    usePKCE: true,
};

const authorizationManager = createAuthorizationManager({ authorizationConfig });

const refreshHandler = createRefreshHandler(authorizationManager);
refreshHandler.startAutomaticRefresh(60);

const apiClient = createHttpClient(config.API_URL, authorizationManager);
const sitesConfig = JSON.parse(config.SITES_CONFIG);
const apolloClient = createApolloClient({ authorizationConfig, refreshHandler });

const categories: AllCategories = [
    {
        category: "MainNavigation",
        label: <FormattedMessage id="cometDemo.menu.pageTree.mainNavigation" defaultMessage="Main navigation" />,
    },
    {
        category: "TopMenu",
        label: <FormattedMessage id="cometDemo.menu.pageTree.topMenu" defaultMessage="Top menu" />,
    },
];

const pageTreeDocumentTypes = {
    Page,
    Link,
    PredefinedPage,
};

const RedirectsPage = createRedirectsPage({ customTargets: { news: NewsLinkBlock } });

class App extends React.Component {
    public static render(baseEl: Element): void {
        ReactDOM.render(<App />, baseEl);
    }

    public render(): JSX.Element {
        return (
            <BuildInformationProvider value={{ date: config.BUILD_DATE, number: config.BUILD_NUMBER, commitHash: config.COMMIT_SHA }}>
                <ApolloProvider client={apolloClient}>
                    <AuthorizationProvider authorizationManager={authorizationManager}>
                        <SitesConfigProvider
                            value={{
                                configs: sitesConfig,
                                resolveSiteConfigForScope: (configs: Record<string, SiteConfig>, scope: ContentScope) => configs[scope.domain],
                            }}
                        >
                            <DamConfigProvider value={{}}>
                                <IntlProvider locale="en" messages={getMessages()}>
                                    <LocaleProvider resolveLocaleForScope={(scope: ContentScope) => scope.domain}>
                                        <MuiThemeProvider theme={theme}>
                                            <RouterBrowserRouter>
                                                <AuthorizationGate renderErrorPage={AuthorizationErrorPage}>
                                                    <DndProvider backend={HTML5Backend}>
                                                        <SnackbarProvider>
                                                            <CmsBlockContextProvider
                                                                damConfig={{
                                                                    apiUrl: config.API_URL,
                                                                    apiClient,
                                                                    maxFileSize: config.DAM_UPLOADS_MAX_FILE_SIZE,
                                                                    maxSrcResolution: config.IMGPROXY_MAX_SRC_RESOLUTION,
                                                                    allowedImageAspectRatios: config.DAM_ALLOWED_IMAGE_ASPECT_RATIOS.split(","),
                                                                }}
                                                                pageTreeCategories={categories}
                                                                pageTreeDocumentTypes={pageTreeDocumentTypes}
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
                                                                                        <MasterLayout
                                                                                            headerComponent={MasterHeader}
                                                                                            menuComponent={MasterMenu}
                                                                                        >
                                                                                            <Switch>
                                                                                                <RouteWithErrorBoundary
                                                                                                    path={`${match.path}/dashboard`}
                                                                                                    component={Dashboard}
                                                                                                />
                                                                                                <RouteWithErrorBoundary
                                                                                                    path={`${match.path}/project-snips/main-menu`}
                                                                                                    component={MainMenu}
                                                                                                />
                                                                                                <Route
                                                                                                    path={`${match.path}/pages/pagetree/:category`}
                                                                                                    render={({ match: { params } }) => {
                                                                                                        const category = urlParamToCategory(
                                                                                                            params.category,
                                                                                                        );

                                                                                                        if (category === undefined) {
                                                                                                            return (
                                                                                                                <Redirect
                                                                                                                    to={`${match.url}/dashboard`}
                                                                                                                />
                                                                                                            );
                                                                                                        }

                                                                                                        return (
                                                                                                            <PagesPage
                                                                                                                path={`/pages/pagetree/${params.category}`}
                                                                                                                allCategories={categories}
                                                                                                                documentTypes={pageTreeDocumentTypes}
                                                                                                                editPageNode={EditPageNode}
                                                                                                                category={category}
                                                                                                                renderContentScopeIndicator={(
                                                                                                                    scope,
                                                                                                                ) => {
                                                                                                                    return (
                                                                                                                        <ContentScopeIndicator variant="toolbar">
                                                                                                                            <ScopeIndicatorContent>
                                                                                                                                <Domain fontSize="small" />
                                                                                                                                <ScopeIndicatorLabelBold variant="body2">
                                                                                                                                    {scope.domain}
                                                                                                                                </ScopeIndicatorLabelBold>
                                                                                                                            </ScopeIndicatorContent>
                                                                                                                            {` | `}
                                                                                                                            <ScopeIndicatorLabel variant="body2">
                                                                                                                                {scope.language}
                                                                                                                            </ScopeIndicatorLabel>
                                                                                                                        </ContentScopeIndicator>
                                                                                                                    );
                                                                                                                }}
                                                                                                            />
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                                <RouteWithErrorBoundary
                                                                                                    path={`${match.path}/structured-content/news`}
                                                                                                    component={News}
                                                                                                />
                                                                                                <RouteWithErrorBoundary
                                                                                                    path={`${match.path}/assets`}
                                                                                                    component={DamPage}
                                                                                                />

                                                                                                <RouteWithErrorBoundary
                                                                                                    path={`${match.path}/system/publisher`}
                                                                                                    component={Publisher}
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
                                                                                                    component={Products}
                                                                                                />
                                                                                                
                                                                                                <Redirect
                                                                                                    from={`${match.path}`}
                                                                                                    to={`${match.url}/dashboard`}
                                                                                                />
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
                                                </AuthorizationGate>
                                            </RouterBrowserRouter>
                                        </MuiThemeProvider>
                                    </LocaleProvider>
                                </IntlProvider>
                            </DamConfigProvider>
                        </SitesConfigProvider>
                    </AuthorizationProvider>
                </ApolloProvider>
            </BuildInformationProvider>
        );
    }
}
export default App;
