import "material-design-icons/iconfont/material-icons.css";
import "typeface-open-sans";

import { ErrorDialogProvider, MasterLayout, MuiThemeProvider, RouterBrowserRouter, RouteWithErrorBoundary, SnackbarProvider } from "@comet/admin";
import {
    AllCategories,
    CmsBlockContextProvider,
    createHttpClient,
    DamPage,
    LocaleProvider,
    PagesPage,
    Publisher,
    Redirects,
    SiteConfig,
    SitePreview,
    SitesConfigProvider,
} from "@comet/admin-cms";
import ApolloProvider from "@src/common/ApolloProvider";
import ContentScopeProvider, { ContentScope } from "@src/common/ContentScopeProvider";
import MasterHeader from "@src/common/MasterHeader";
import MasterMenu from "@src/common/MasterMenu";
import UserProvider, { userService } from "@src/common/UserProvider";
import config from "@src/config";
import Dashboard from "@src/dashboard/Dashboard";
import theme from "@src/theme";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Redirect, Route, Switch } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import * as Webfontloader from "webfontloader";

import { ComponentDemo } from "./common/ComponentDemo";
import { getMessages } from "./lang";
import { Link } from "./links/Link";
import News from "./news/News";
import MainMenu from "./pages/mainMenu/MainMenu";
import { Page } from "./pages/Page";

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
    }
`;

const apiClient = createHttpClient(config.API_URL, userService);
const sitesConfig = JSON.parse(config.SITES_CONFIG);

const categories: AllCategories = [
    {
        category: "MainNavigation",
        label: <FormattedMessage id="comet.menu.pageTree.mainNavigation" defaultMessage="Main navigation" />,
    },
];

class App extends React.Component {
    public static render(baseEl: Element): void {
        Webfontloader.load({
            google: {
                families: ["Roboto:100,300,400,500,700"],
            },
        });

        ReactDOM.render(<App />, baseEl);
    }

    public render(): JSX.Element {
        return (
            <>
                <SitesConfigProvider
                    value={{
                        configs: sitesConfig,
                        resolveSiteConfigForScope: (configs: Record<string, SiteConfig>, scope: ContentScope) => configs[scope.domain],
                    }}
                >
                    <IntlProvider messages={getMessages()} locale="en">
                        <LocaleProvider resolveLocaleForScope={(scope: ContentScope) => scope.domain}>
                            <MuiThemeProvider theme={theme}>
                                <RouterBrowserRouter>
                                    <UserProvider>
                                        <ErrorDialogProvider>
                                            <ApolloProvider>
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
                                                                                                render={() => (
                                                                                                    <PagesPage
                                                                                                        category="MainNavigation"
                                                                                                        allCategories={categories}
                                                                                                        path="/pages/pagetree/main-navigation"
                                                                                                        documentTypes={{ Page, Link }}
                                                                                                    />
                                                                                                )}
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
                                                                                                    <Redirects
                                                                                                        redirectPathAfterChange="/system/redirects"
                                                                                                        allCategories={categories}
                                                                                                    />
                                                                                                )}
                                                                                            />

                                                                                            <RouteWithErrorBoundary
                                                                                                path={`${match.path}/component-demo`}
                                                                                                component={ComponentDemo}
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
                                                            </React.Fragment>
                                                        </CmsBlockContextProvider>
                                                    </SnackbarProvider>
                                                </DndProvider>
                                            </ApolloProvider>
                                        </ErrorDialogProvider>
                                    </UserProvider>
                                </RouterBrowserRouter>
                            </MuiThemeProvider>
                        </LocaleProvider>
                    </IntlProvider>
                </SitesConfigProvider>
            </>
        );
    }
}
export default App;
