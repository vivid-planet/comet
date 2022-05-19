import { onError } from "@apollo/client/link/error";

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
                errorDialogVar({ error: networkError.message });
            }
        }
    });
};
