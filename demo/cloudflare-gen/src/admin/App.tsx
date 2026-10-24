import "@fontsource-variable/roboto-flex/full.css";

import { createDextinityTheme, MasterLayout, MuiThemeProvider, RouterBrowserRouter, SnackbarProvider } from "@dextinity/admin";
import { ApiProvider, QueryErrorHandler } from "@dextinity/core/client";
import { DamApiProvider, DamPage } from "@dextinity/dam/client";
import { CurrentUserProvider, useAllowedContentScopes } from "@dextinity/permissions/client";
import { css, Global } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import { Redirect, Route, Switch } from "react-router";

import { MasterHeader } from "./MasterHeader";
import { MasterMenu } from "./MasterMenu";

const theme = createDextinityTheme();
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

export function App() {
    return (
        <IntlProvider locale="en" defaultLocale="en">
            <MuiThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <SnackbarProvider>
                        <QueryErrorHandler />
                        {/* The admin and the API are served by the same Worker */}
                        <ApiProvider apiUrl="/api">
                            <CurrentUserProvider>
                                <RouterBrowserRouter>
                                    <Global styles={globalStyles} />
                                    <AppContent />
                                </RouterBrowserRouter>
                            </CurrentUserProvider>
                        </ApiProvider>
                    </SnackbarProvider>
                </QueryClientProvider>
            </MuiThemeProvider>
        </IntlProvider>
    );
}

function AppContent() {
    const damScopes = useAllowedContentScopes("dam");
    const [scope, setScope] = useState(damScopes[0]);

    return (
        <MasterLayout headerComponent={() => <MasterHeader scope={scope} scopes={damScopes} onScopeChange={setScope} />} menuComponent={MasterMenu}>
            {scope ? (
                <DamApiProvider scope={scope}>
                    <Switch>
                        {/* Remounting on scope change resets the folder navigation, folders don't exist in other scopes */}
                        <Route path="/assets" render={() => <DamPage key={scope.domain} />} />
                        <Redirect to="/assets" />
                    </Switch>
                </DamApiProvider>
            ) : (
                <FormattedMessage id="app.noPermissions" defaultMessage="You have no permissions in this application." />
            )}
        </MasterLayout>
    );
}

const globalStyles = css`
    body {
        margin: 0;
    }
`;
