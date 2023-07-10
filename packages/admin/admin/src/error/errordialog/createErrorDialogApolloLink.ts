import { ServerError } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { ErrorDialogLoginMessage } from "./ErrorDialog";
import { errorDialogVar } from "./errorDialogVar";
import { ErrorScope, errorScopeForOperationContext } from "./ErrorScope";

export const createErrorDialogApolloLink = () => {
    return onError(({ graphQLErrors, networkError, operation }) => {
        const errorScope = errorScopeForOperationContext(operation.getContext());

        if (graphQLErrors) {
            graphQLErrors.forEach(({ extensions, message }) => {
                if (errorScope === ErrorScope.Global) {
                    errorDialogVar({ error: message });
                }
            });
        } else if (networkError) {
            if (errorScope === ErrorScope.Global) {
                if (networkError.name === "ServerError" && (networkError as ServerError).statusCode === 401) {
                    errorDialogVar({ userMessage: ErrorDialogLoginMessage, error: networkError.message });
                } else {
                    errorDialogVar({ error: networkError.message });
                }
            }
        }
    });
};
