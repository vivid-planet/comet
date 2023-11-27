import { ServerError } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Button, Typography } from "@mui/material";
import { getReasonPhrase, StatusCodes } from "http-status-codes";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ErrorType } from "./ErrorDialog";
import { errorDialogVar } from "./errorDialogVar";
import { ErrorScope, errorScopeForOperationContext } from "./ErrorScope";

export const createErrorDialogApolloLink = () => {
    return onError(({ graphQLErrors, networkError, operation }) => {
        const errorScope = errorScopeForOperationContext(operation.getContext());

        if (errorScope !== ErrorScope.Global) {
            return;
        }

        let error: string | string[] | undefined;
        let errorType: ErrorType | undefined;
        let title: React.ReactNode | undefined;
        let userMessage: React.ReactNode | undefined;
        let httpStatus: string | undefined;

        if (graphQLErrors) {
            error = graphQLErrors.map(({ message }) => message);
            errorType = "graphql";
            title = <FormattedMessage id="comet.errorDialog.graphQLErrors.title" defaultMessage="Server error" />;
        }

        if (networkError) {
            // Prioritize GraphQL error over network error
            if (!error) {
                error = networkError.message;
                errorType = "network";
                title = <FormattedMessage id="comet.errorDialog.networkError.title" defaultMessage="Network error" />;
            }

            if (networkError.name === "ServerError") {
                const statusCode = (networkError as ServerError).statusCode;
                httpStatus = `${statusCode} ${getReasonPhrase(statusCode)}`;

                if (statusCode === StatusCodes.UNAUTHORIZED) {
                    title = <FormattedMessage id="comet.errorDialog.sessionExpired.title" defaultMessage="Session expired" />;
                    userMessage = (
                        <>
                            <Typography gutterBottom>
                                <FormattedMessage id="comet.errorDialog.sessionExpired.message" defaultMessage="Your login-session has expired." />
                            </Typography>
                            <Button href="/" color="info" variant="outlined">
                                <FormattedMessage id="comet.errorDialog.sessionExpired.button" defaultMessage="Re-login" />
                            </Button>
                        </>
                    );
                }
            }
        }

        errorDialogVar({
            title,
            error: error ?? "Unknown error",
            userMessage,
            additionalInformation: {
                timestamp: new Date().toISOString(),
                errorType: errorType ?? "unknown",
                httpStatus,
                url: window.location.href,
            },
        });
    });
};
