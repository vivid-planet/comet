import { createMuiTheme } from "@material-ui/core";
import { MuiThemeProvider as ThemeProvider } from "@vivid-planet/react-admin-mui";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { RestLink } from "apollo-link-rest";
import * as React from "react";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import * as ReactDOM from "react-dom";
import App from "./App";

const theme = createMuiTheme({});

const link = ApolloLink.from([
    new RestLink({
        uri: "https://swapi.co/api/",
    }),
]);

const cache = new InMemoryCache();

const client = new ApolloClient({
    link,
    cache,
});

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <ApolloHooksProvider client={client}>
            <App />
        </ApolloHooksProvider>
    </ThemeProvider>,
    document.getElementById("root"),
);
