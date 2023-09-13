import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "material-design-icons/iconfont/material-icons.css";
import "typeface-open-sans";

import { ApolloProvider } from "@apollo/client";
import { ErrorDialogHandler, MuiThemeProvider, RouterBrowserRouter, SnackbarProvider } from "@comet/admin";
import { CmsBlockContextProvider, createHttpClient, DamConfigProvider, LocaleProvider, SiteConfig, SitesConfigProvider } from "@comet/cms-admin";
import { css, Global } from "@emotion/react";
import { createApolloClient } from "@src/common/apollo/createApolloClient";
import { ContentScope } from "@src/common/ContentScopeProvider";
import { additionalPageTreeNodeFieldsFragment } from "@src/common/EditPageNode";
import { createConfig } from "@src/config";
import theme from "@src/theme";
import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import * as ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";

import { pageTreeCategories, pageTreeDocumentTypes } from "./common/routeMenu";
import { Routes } from "./common/Routes";
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
                                                    pageTreeCategories={pageTreeCategories}
                                                    pageTreeDocumentTypes={pageTreeDocumentTypes}
                                                    additionalPageTreeNodeFragment={additionalPageTreeNodeFieldsFragment}
                                                >
                                                    <React.Fragment>
                                                        <GlobalStyle />
                                                        <Routes />
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
