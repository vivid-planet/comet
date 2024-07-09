import { ServerError } from "@apollo/client";
import { NetworkError } from "@apollo/client/errors";
import { onError } from "@apollo/client/link/error";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

import { ErrorType } from "./ErrorDialog";
import { errorDialogVar } from "./errorDialogVar";
import { ErrorScope, errorScopeForOperationContext } from "./ErrorScope";

export const createErrorDialogApolloLink = (config?: { signInUrl?: string }) => {
    return onError(({ graphQLErrors, networkError, operation }) => {
        const errorScope = errorScopeForOperationContext(operation.getContext());

        if (errorScope !== ErrorScope.Global) {
            return;
        }

        let error: string | string[] | undefined;
        let errorType: ErrorType | undefined;
        let httpStatus: string | undefined;
        let isUnauthenticated = false;

        if (graphQLErrors) {
            error = graphQLErrors.map(({ message }) => message);
<<<<<<< HEAD
            errorType = "graphql";
            title = <FormattedMessage id="comet.errorDialog.graphQLErrors.title" defaultMessage="Server error" />;
            isUnauthenticated = graphQLErrors.some(
                (e) => e.extensions?.exception?.status === StatusCodes.UNAUTHORIZED || e.extensions?.code === "UNAUTHENTICATED",
            );
=======
            if (graphQLErrors.some((e) => e.message === "UNAUTHENTICATED")) {
                errorType = "unauthenticated"; // Error is triggered by Comet Guard
            } else if (graphQLErrors.some((e) => e.extensions.response.statusCode === StatusCodes.UNAUTHORIZED)) {
                errorType = "unauthorized"; // Error is triggered by UnauthorizedException
            } else {
                errorType = "graphql";
            }
>>>>>>> main
        }

        if (networkError) {
            // Prioritize GraphQL error over network error
            if (!error) {
                error = networkError.message;
                errorType = "network";
            }

            if (isServerError(networkError)) {
                const { statusCode } = networkError;
                httpStatus = `${statusCode} ${getReasonPhrase(statusCode)}`;
<<<<<<< HEAD
                isUnauthenticated = statusCode === StatusCodes.UNAUTHORIZED;
=======
                if (statusCode === StatusCodes.UNAUTHORIZED) {
                    errorType = "unauthenticated"; // Error is triggered by AuthProxy
                }
>>>>>>> main
            }
        }

        if (isUnauthenticated) {
            title = <FormattedMessage id="comet.errorDialog.sessionExpired.title" defaultMessage="Session expired" />;
            userMessage = (
                <>
                    <Typography gutterBottom>
                        <FormattedMessage id="comet.errorDialog.sessionExpired.message" defaultMessage="Your login-session has expired." />
                    </Typography>
                    <Button href={config?.signInUrl ?? "/"} color="info" variant="outlined">
                        <FormattedMessage id="comet.errorDialog.sessionExpired.button" defaultMessage="Re-login" />
                    </Button>
                </>
            );
        }

        errorDialogVar({
            error: error ?? "Unknown error",
            additionalInformation: {
                timestamp: new Date().toISOString(),
                errorType: errorType ?? "unknown",
                httpStatus,
                url: window.location.href,
            },
        });
    });
};

function isServerError(error: NetworkError): error is ServerError {
    return error !== null && error.name === "ServerError";
}
