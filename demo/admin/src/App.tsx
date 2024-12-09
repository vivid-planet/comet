import "@fontsource-variable/roboto-flex/full.css";
import "@src/polyfills";

import { ApolloProvider } from "@apollo/client";
import { ErrorDialogHandler, MasterLayout, MuiThemeProvider, RouterBrowserRouter, SnackbarProvider } from "@comet/admin";
import {
    CmsBlockContextProvider,
    ContentScopeInterface,
    createDamFileDependency,
    createHttpClient,
    CurrentUserProvider,
    DamConfigProvider,
    DependenciesConfigProvider,
    LocaleProvider,
    MasterMenuRoutes,
    SitePreview,
    SitesConfigProvider,
} from "@comet/cms-admin";
import { css, Global } from "@emotion/react";
import { createApolloClient } from "@src/common/apollo/createApolloClient";
import ContentScopeProvider, { ContentScope } from "@src/common/ContentScopeProvider";
import { additionalPageTreeNodeFieldsFragment } from "@src/common/EditPageNode";
import { ConfigProvider, createConfig } from "@src/config";
import { ImportFromUnsplash } from "@src/dam/ImportFromUnsplash";
import { pageTreeCategories } from "@src/pageTree/pageTreeCategories";
import { theme } from "@src/theme";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { Component, Fragment } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import * as ReactDOM from "react-dom";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Route, Switch } from "react-router-dom";

import MasterHeader from "./common/MasterHeader";
import MasterMenu, { masterMenuData, pageTreeDocumentTypes } from "./common/MasterMenu";
import { getMessages } from "./lang";
import { Link } from "./links/Link";
import { NewsDependency } from "./news/dependencies/NewsDependency";
import { Page } from "./pages/Page";

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

class App extends Component {
    public static render(baseEl: Element): void {
        ReactDOM.render(<App />, baseEl);
    }

    public render(): JSX.Element {
        return (
            <ConfigProvider config={config}>
                <ApolloProvider client={apolloClient}>
                    <SitesConfigProvider
                        value={{
                            configs: [...config.sitesConfig],
                            resolveSiteConfigForScope: (configs, scope) => {
                                const siteConfig = configs.find((config) => config.scope.domain === scope.domain);
                                if (!siteConfig) throw new Error(`siteConfig not found for domain ${scope.domain}`);
                                return {
                                    url: siteConfig.url,
                                    preloginEnabled: siteConfig.preloginEnabled || false,
                                    blockPreviewBaseUrl:
                                        siteConfig.scope.domain === "secondary"
                                            ? `${siteConfig.url}/block-preview`
                                            : `${siteConfig.url}/block-preview/${scope.domain}/${scope.language}`,
                                    sitePreviewApiUrl: `${siteConfig.url}/api/site-preview`,
                                };
                            },
                        }}
                    >
                        <DamConfigProvider
                            value={{
                                scopeParts: ["domain"],
                                additionalToolbarItems: <ImportFromUnsplash />,
                                importSources: {
                                    unsplash: {
                                        label: <FormattedMessage id="dam.importSource.unsplash.label" defaultMessage="Unsplash" />,
                                    },
                                },
                                contentGeneration: {
                                    generateAltText: true,
                                    generateImageTitle: true,
                                },
                            }}
                        >
                            <DependenciesConfigProvider
                                entityDependencyMap={{
                                    Page,
                                    Link,
                                    News: NewsDependency,
                                    DamFile: createDamFileDependency(),
                                }}
                            >
                                <IntlProvider locale="en" messages={getMessages()}>
                                    <LocaleProvider resolveLocaleForScope={(scope: ContentScope) => scope.domain}>
                                        <MuiThemeProvider theme={theme}>
                                            <ErrorDialogHandler />
                                            <CurrentUserProvider>
                                                <RouterBrowserRouter>
                                                    <DndProvider options={HTML5toTouch}>
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
                                                                <Fragment>
                                                                    <GlobalStyle />
                                                                    <ContentScopeProvider>
                                                                        {({ match }) => (
                                                                            <Switch>
                                                                                {/* @TODO: add preview to contentScope once site is capable of contentScope */}
                                                                                <Route
                                                                                    path={`${match.path}/preview`}
                                                                                    render={(props) => (
                                                                                        <SitePreview
                                                                                            resolvePath={(
                                                                                                path: string,
                                                                                                scope: ContentScopeInterface,
                                                                                            ) => {
                                                                                                return `/${scope.language}${path}`;
                                                                                            }}
                                                                                            {...props}
                                                                                        />
                                                                                    )}
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
                                                                </Fragment>
                                                            </CmsBlockContextProvider>
                                                        </SnackbarProvider>
                                                    </DndProvider>
                                                </RouterBrowserRouter>
                                            </CurrentUserProvider>
                                        </MuiThemeProvider>
                                    </LocaleProvider>
                                </IntlProvider>
                            </DependenciesConfigProvider>
                        </DamConfigProvider>
                    </SitesConfigProvider>
                </ApolloProvider>
            </ConfigProvider>
        );
    }
}
export default App;
