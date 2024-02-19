import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "material-design-icons/iconfont/material-icons.css";
import "typeface-open-sans";

import { ApolloProvider } from "@apollo/client";
import { ErrorDialogHandler, MasterLayout, MuiThemeProvider, RouterBrowserRouter, SnackbarProvider } from "@comet/admin";
import { MlServiceContext } from "@comet/admin/lib/ml/MlServiceContext";
import {
    CmsBlockContextProvider,
    createHttpClient,
    CurrentUserProvider,
    DamConfigProvider,
    LocaleProvider,
    MasterMenuRoutes,
    SitePreview,
    SitesConfigProvider,
} from "@comet/cms-admin";
import { css, Global } from "@emotion/react";
import { createApolloClient } from "@src/common/apollo/createApolloClient";
import ContentScopeProvider, { ContentScope } from "@src/common/ContentScopeProvider";
import { additionalPageTreeNodeFieldsFragment } from "@src/common/EditPageNode";
import { createConfig } from "@src/config";
import { ImportFromUnsplash } from "@src/dam/ImportFromUnsplash";
import { pageTreeCategories } from "@src/pageTree/pageTreeCategories";
import theme from "@src/theme";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";
import { Route, Switch } from "react-router-dom";

import MasterHeader from "./common/MasterHeader";
import MasterMenu, { masterMenuData, pageTreeDocumentTypes } from "./common/MasterMenu";
import { getMessages } from "./lang";

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

class App extends React.Component {
    public static render(baseEl: Element): void {
        ReactDOM.render(<App />, baseEl);
    }

    public render(): JSX.Element {
        return (
            <MlServiceContext.Provider value={{ enabled: true }}>
                <ApolloProvider client={apolloClient}>
                    <CurrentUserProvider>
                        <SitesConfigProvider
                            value={{
                                configs: config.sitesConfig,
                                resolveSiteConfigForScope: (configs, scope: ContentScope) => configs[scope.domain],
                            }}
                        >
                            <DamConfigProvider value={{ scopeParts: ["domain"], additionalToolbarItems: <ImportFromUnsplash /> }}>
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
                                                            pageTreeCategories={pageTreeCategories}
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
                                                                                render={() => (
                                                                                    <MasterLayout
                                                                                        headerComponent={MasterHeader}
                                                                                        menuComponent={MasterMenu}
                                                                                    >
                                                                                        <MasterMenuRoutes menu={masterMenuData} />
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
                    </CurrentUserProvider>
                </ApolloProvider>
            </MlServiceContext.Provider>
        );
    }
}
export default App;
