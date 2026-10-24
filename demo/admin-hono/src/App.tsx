import "@fontsource-variable/roboto-flex/full.css";

import { createDextinityTheme, MasterLayout, MuiThemeProvider, RouterBrowserRouter, SnackbarProvider } from "@dextinity/admin";
import { DamApiProvider, DamPage, type DamScope } from "@dextinity/cms-admin-hono";
import { css, Global } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
import { Redirect, Route, Switch } from "react-router";

import { MasterHeader } from "./MasterHeader";
import { MasterMenu } from "./MasterMenu";

const theme = createDextinityTheme();
const queryClient = new QueryClient();
// The Vite dev server proxies /api to the Hono API, see vite.config.mts
const apiUrl = `${window.location.origin}/api`;

export function App() {
    const [domain, setDomain] = useState("main");
    const scope = useMemo<DamScope>(() => ({ domain }), [domain]);

    return (
        <IntlProvider locale="en" defaultLocale="en">
            <MuiThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <SnackbarProvider>
                        <RouterBrowserRouter>
                            <Global styles={globalStyles} />
                            <DamApiProvider apiUrl={apiUrl} scope={scope}>
                                <MasterLayout
                                    headerComponent={() => <MasterHeader domain={domain} onDomainChange={setDomain} />}
                                    menuComponent={MasterMenu}
                                >
                                    <Switch>
                                        {/* Remounting on scope change resets the folder navigation, folders don't exist in other scopes */}
                                        <Route path="/assets" render={() => <DamPage key={domain} />} />
                                        <Redirect to="/assets" />
                                    </Switch>
                                </MasterLayout>
                            </DamApiProvider>
                        </RouterBrowserRouter>
                    </SnackbarProvider>
                </QueryClientProvider>
            </MuiThemeProvider>
        </IntlProvider>
    );
}

const globalStyles = css`
    body {
        margin: 0;
    }
`;
