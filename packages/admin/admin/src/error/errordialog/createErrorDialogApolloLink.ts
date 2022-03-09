import { ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { ErrorDialogContextProps } from "./ErrorDialogContext";
import { ErrorScope, errorScopeForOperationContext, LocalErrorScopeApolloContext } from "./ErrorScope";

export interface ErrorDialogApolloLinkOptions {
    errorDialog?: ErrorDialogContextProps;
}
export const createErrorDialogApolloLink = ({ errorDialog }: ErrorDialogApolloLinkOptions): ApolloLink => {
    return onError(({ graphQLErrors, networkError, operation }) => {
        if (errorDialog) {
            const errorScope = errorScopeForOperationContext(operation.getContext() as typeof LocalErrorScopeApolloContext);

            if (graphQLErrors) {
                graphQLErrors.forEach(({ extensions, message }) => {
                    if (errorScope === ErrorScope.Global) {
                        errorDialog.showError({ error: message });
                    }
                });
            } else if (networkError) {
                if (errorScope === ErrorScope.Global) {
                    errorDialog.showError({ error: networkError.message });
                }
            }
        }
    });
};
