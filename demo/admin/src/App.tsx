import "@fontsource-variable/roboto-flex/full.css";
import "@src/polyfills";

import { ApolloProvider } from "@apollo/client";
import { ErrorDialogHandler, MasterLayout, MuiThemeProvider, RouterBrowserRouter, SnackbarProvider } from "@comet/admin";
import {
    BuildInformationProvider,
    CmsBlockContextProvider,
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
import { ConfigProvider, createConfig } from "@src/config";
import { theme } from "@src/theme";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { DndProvider } from "react-dnd-multi-backend";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Route, Switch } from "react-router";

import { ContentScopeProvider } from "./common/ContentScopeProvider";
import { additionalPageTreeNodeFieldsFragment } from "./common/EditPageNode";
import MasterHeader from "./common/MasterHeader";
import { AppMasterMenu, masterMenuData, pageTreeDocumentTypes } from "./common/MasterMenu";
import { ImportFromPicsum } from "./dam/ImportFromPicsum";
import { Link } from "./documents/links/Link";
import { Page } from "./documents/pages/Page";
import { getMessages } from "./lang";
import { NewsDependency } from "./news/dependencies/NewsDependency";
import { pageTreeCategories } from "./pageTree/pageTreeCategories";
import { RedirectDependency } from "./redirects/RedirectsDependency";

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

export function App() {
    return (
        <ConfigProvider config={config}>
            <ApolloProvider client={apolloClient}>
                <BuildInformationProvider value={{ date: config.buildDate, number: config.buildNumber, commitHash: config.commitSha }}>
                    <SitesConfigProvider
                        value={{
                            configs: config.sitesConfig,
                            resolveSiteConfigForScope: (configs, scope) => {
                                const siteConfig = configs.find((config) => {
                                    return config.scope.domain === scope.domain;
                                });

                                if (!siteConfig) throw new Error(`siteConfig not found for domain ${scope.domain}`);
                                return {
                                    url: siteConfig.url,
                                    preloginEnabled: siteConfig.preloginEnabled || false,
                                    blockPreviewBaseUrl:
                                        siteConfig.scope.domain === "secondary"
                                            ? `${siteConfig.url}/block-preview`
                                            : `${siteConfig.url}/block-preview/${scope.domain}/${scope.language}`,
                                    sitePreviewApiUrl: `${siteConfig.url}/site-preview`,
                                };
                            },
                        }}
                    >
                        <DamConfigProvider
                            value={{
                                scopeParts: ["domain"],
                                additionalToolbarItems: <ImportFromPicsum />,
                                importSources: {
                                    picsum: {
                                        label: <FormattedMessage id="dam.importSource.picsum.label" defaultMessage="Lorem Picsum" />,
                                    },
                                },
                                contentGeneration: {
                                    generateAltText: true,
                                    generateImageTitle: true,
                                },
                                requireLicense: true,
                                enableLicenseFeature: true,
                            }}
                        >
                            <DependenciesConfigProvider
                                entityDependencyMap={{
                                    Page,
                                    Link,
                                    News: NewsDependency,
                                    Redirect: RedirectDependency,
                                    DamFile: createDamFileDependency(),
                                }}
                            >
                                <IntlProvider locale="en" messages={getMessages()}>
                                    <LocaleProvider resolveLocaleForScope={(scope) => scope.domain}>
                                        <MuiThemeProvider theme={theme}>
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
                                                        <ErrorDialogHandler />
                                                        <CurrentUserProvider>
                                                            <RouterBrowserRouter>
                                                                <GlobalStyle />
                                                                <ContentScopeProvider>
                                                                    {({ match }) => (
                                                                        <Switch>
                                                                            <Route
                                                                                path={`${match.path}/preview`}
                                                                                render={(props) => (
                                                                                    <SitePreview
                                                                                        resolvePath={(path: string, scope) => {
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
                                                                                        menuComponent={AppMasterMenu}
                                                                                    >
                                                                                        <MasterMenuRoutes menu={masterMenuData} />
                                                                                    </MasterLayout>
                                                                                )}
                                                                            />
                                                                        </Switch>
                                                                    )}
                                                                </ContentScopeProvider>
                                                            </RouterBrowserRouter>
                                                        </CurrentUserProvider>
                                                    </CmsBlockContextProvider>
                                                </SnackbarProvider>
                                            </DndProvider>
                                        </MuiThemeProvider>
                                    </LocaleProvider>
                                </IntlProvider>
                            </DependenciesConfigProvider>
                        </DamConfigProvider>
                    </SitesConfigProvider>
                </BuildInformationProvider>
            </ApolloProvider>
        </ConfigProvider>
    );
}
