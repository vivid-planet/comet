import "@fontsource-variable/roboto-flex/full.css";
import "@src/polyfills";

import { ApolloProvider } from "@apollo/client";
import { ErrorDialogHandler, MasterLayout, RouterBrowserRouter, SnackbarProvider } from "@comet/admin";
import {
    CometConfigProvider,
    type ContentScope,
    ContentScopeProvider,
    createDamFileDependency,
    CurrentUserProvider,
    MasterMenuRoutes,
    SitePreview,
} from "@comet/cms-admin";
import { css, Global } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { createApolloClient } from "@src/common/apollo/createApolloClient";
import { createConfig } from "@src/config";
import { type ContentScope as BaseContentScope } from "@src/site-configs";
import { enUS } from "date-fns/locale";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { DndProvider } from "react-dnd-multi-backend";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Route, Switch } from "react-router";

import { additionalPageTreeNodeFieldsFragment } from "./common/EditPageNode";
import MasterHeader from "./common/MasterHeader";
import { AppMasterMenu, masterMenuData, pageTreeDocumentTypes } from "./common/MasterMenu";
import { ThemeProvider } from "./common/ThemeProvider";
import { ImportFromPicsum } from "./dam/ImportFromPicsum";
import { Link } from "./documents/links/Link";
import { Page } from "./documents/pages/Page";
import { getMessages } from "./lang";
import { NewsDetailBlock } from "./news/blocks/NewsDetailBlock";
import { NewsLinkBlock } from "./news/blocks/NewsLinkBlock";
import { NewsListBlock } from "./news/blocks/NewsListBlock";
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

declare module "@comet/cms-admin" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ContentScope extends BaseContentScope {}
}

export function App() {
    return (
        <CometConfigProvider
            {...config}
            graphQLApiUrl={`${config.apiUrl}/graphql`}
            pageTree={{
                categories: pageTreeCategories,
                documentTypes: pageTreeDocumentTypes,
                additionalPageTreeNodeFragment: additionalPageTreeNodeFieldsFragment,
                scopeParts: ["domain", "language"],
            }}
            dam={{
                ...config.dam,
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
            }}
            dependencies={{
                entityDependencyMap: {
                    Page,
                    Link,
                    News: NewsDependency,
                    Redirect: RedirectDependency,
                    DamFile: createDamFileDependency(),
                },
            }}
            siteConfigs={{
                configs: config.siteConfigs,
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
            buildInformation={{ date: config.buildDate, number: config.buildNumber, commitHash: config.commitSha }}
            contentLanguage={{ resolveContentLanguageForScope: (scope: ContentScope) => scope.language }}
            blocks={{
                isBlockSupported: (block, scope) => {
                    if (scope.domain === "main") {
                        return true;
                    } else {
                        return block.name !== NewsDetailBlock.name && block.name !== NewsListBlock.name && block.name !== NewsLinkBlock.name;
                    }
                },
            }}
        >
            <ApolloProvider client={apolloClient}>
                <IntlProvider locale="en" messages={getMessages()}>
                    <LocalizationProvider adapterLocale={enUS} dateAdapter={AdapterDateFns}>
                        <ThemeProvider>
                            <DndProvider options={HTML5toTouch}>
                                <SnackbarProvider>
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
                                                                <MasterLayout headerComponent={MasterHeader} menuComponent={AppMasterMenu}>
                                                                    <MasterMenuRoutes menu={masterMenuData} />
                                                                </MasterLayout>
                                                            )}
                                                        />
                                                    </Switch>
                                                )}
                                            </ContentScopeProvider>
                                        </RouterBrowserRouter>
                                    </CurrentUserProvider>
                                </SnackbarProvider>
                            </DndProvider>
                        </ThemeProvider>
                    </LocalizationProvider>
                </IntlProvider>
            </ApolloProvider>
        </CometConfigProvider>
    );
}
