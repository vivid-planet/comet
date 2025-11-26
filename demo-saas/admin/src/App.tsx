import "@fontsource-variable/roboto-flex/full.css";
import "@src/polyfills";

import { ApolloProvider } from "@apollo/client";
import { ErrorDialogHandler, MasterLayout, MuiThemeProvider, RouterBrowserRouter, SnackbarProvider } from "@comet/admin";
import { CometConfigProvider, type ContentScope, ContentScopeProvider, CurrentUserProvider, MasterMenuRoutes, SitePreview } from "@comet/cms-admin";
import { css, Global } from "@emotion/react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LicenseInfo } from "@mui/x-license";
import { createApolloClient } from "@src/common/apollo/createApolloClient";
import { createConfig } from "@src/config";
import { theme } from "@src/theme";
import { enUS } from "date-fns/locale";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { DndProvider } from "react-dnd-multi-backend";
import { IntlProvider } from "react-intl";
import { Route, Switch } from "react-router";

import { type ContentScope as BaseContentScope } from "./common/ContentScope";
import MasterHeader from "./common/MasterHeader";
import { AppMasterMenu, masterMenuData } from "./common/MasterMenu";
import { type GQLPermission } from "./graphql.generated";
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

declare module "@comet/cms-admin" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ContentScope extends BaseContentScope {}

    export interface PermissionOverrides {
        permission: GQLPermission;
    }
}

LicenseInfo.setLicenseKey(config.muiLicenseKey);

export function App() {
    return (
        <CometConfigProvider
            {...config}
            graphQLApiUrl={`${config.apiUrl}/graphql`}
            buildInformation={{ date: config.buildDate, number: config.buildNumber, commitHash: config.commitSha }}
            contentLanguage={{ resolveContentLanguageForScope: (scope: ContentScope) => scope.language }}
        >
            <ApolloProvider client={apolloClient}>
                <IntlProvider locale="en" messages={getMessages("en")}>
                    <LocalizationProvider adapterLocale={enUS} dateAdapter={AdapterDateFns}>
                        <MuiThemeProvider theme={theme}>
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
                        </MuiThemeProvider>
                    </LocalizationProvider>
                </IntlProvider>
            </ApolloProvider>
        </CometConfigProvider>
    );
}
