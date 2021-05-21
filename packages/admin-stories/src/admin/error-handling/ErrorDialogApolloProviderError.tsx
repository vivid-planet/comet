import { ApolloClient, ApolloLink, ApolloProvider, createHttpLink, InMemoryCache, useQuery } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { ErrorDialogOptions, ErrorDialogProvider, ErrorScope, errorScopeForOperationContext, useErrorDialog } from "@comet/admin";
import { Button, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import gql from "graphql-tag";
import * as React from "react";

const Story: React.FunctionComponent = () => {
    const [brokenQuery, setBrokenQuery] = React.useState(false);
    const query = brokenQuery ? "{ allFilms { films { somenotavailablefield } } }" : "{ allFilms { films { title } } }";
    const { data, error } = useQuery(
        gql`
            ${query}
        `,
    );

    return (
        <>
            <Typography variant={"h4"}>
                Development Story - only for testing purpose if errordialog - apollo provider does enter rerender loop
            </Typography>

            <div style={{ backgroundColor: brokenQuery ? "red" : "green" }}>
                <Typography variant={"h4"}>Current Query: {brokenQuery ? "broken" : "working"}</Typography>
            </div>

            <Button
                variant={"contained"}
                color={"primary"}
                onClick={() => {
                    setBrokenQuery(!brokenQuery);
                }}
            >
                <Typography>Change Query</Typography>
            </Button>
            <Typography>Query: {query}</Typography>
            {error ? (
                <div>
                    <Typography>
                        Error:
                        <br />
                        {JSON.stringify(error)}
                    </Typography>
                </div>
            ) : (
                <div>
                    <Typography>
                        Response:
                        <br />
                        {JSON.stringify(data)}
                    </Typography>
                </div>
            )}
        </>
    );
};

const CustomApolloProvider: React.FunctionComponent = ({ children }) => {
    const errorDialog = useErrorDialog();

    const link = ApolloLink.from([
        onError(({ graphQLErrors, networkError, operation }) => {
            if (errorDialog) {
                const errorScope = errorScopeForOperationContext(operation.getContext());

                if (graphQLErrors) {
                    graphQLErrors.forEach(({ extensions, message }) => {
                        if (errorScope === ErrorScope.Global) {
                            const errorDialogOptions: ErrorDialogOptions = { error: message };
                            console.log("## message: ", errorDialog, errorDialogOptions);
                            errorDialog.showError(errorDialogOptions);
                        }
                    });
                } else if (networkError) {
                    if (errorScope === ErrorScope.Global) {
                        errorDialog.showError({ error: networkError.message });
                    }
                }
            }
        }),
        createHttpLink({
            uri: `https://swapi-graphql.netlify.app/.netlify/functions/index`, // Test API here: https://graphql.org/swapi-graphql
        }),
    ]);
    const cache = new InMemoryCache();

    const apolloClient = new ApolloClient({
        link,
        cache,
    });
    return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
storiesOf("@comet/admin/error-handling", module).add("ErrorDialog-ApolloProvider-Error", () => (
    <ErrorDialogProvider>
        <CustomApolloProvider>
            <Story />
        </CustomApolloProvider>
    </ErrorDialogProvider>
));
