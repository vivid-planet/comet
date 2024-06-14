import { ServerError } from "@apollo/client";
import { NetworkError } from "@apollo/client/errors";
import { onError } from "@apollo/client/link/error";
import { getReasonPhrase, StatusCodes } from "http-status-codes";

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
        let httpStatus: string | undefined;

        if (graphQLErrors) {
            error = graphQLErrors.map(({ message }) => message);
            if (graphQLErrors.some((e) => e.message === "UNAUTHENTICATED")) {
                errorType = "unauthenticated"; // Error is triggered by Comet Guard
            } else if (
                graphQLErrors.some((e) => e.extensions?.code === "UNAUTHENTICATED" || e.extensions?.exception?.status === StatusCodes.UNAUTHORIZED)
            ) {
                errorType = "unauthorized"; // Error is triggered by UnauthorizedException (which triggers an unauthenticated error code)
            } else {
                errorType = "graphql";
            }
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
                if (statusCode === StatusCodes.UNAUTHORIZED) {
                    errorType = "unauthenticated"; // Error is triggered by AuthProxy
                }
            }
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
