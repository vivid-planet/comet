export enum ErrorScope {
    Local = "local",
    Global = "global",
}

export const ErrorScopeContextIdentifier = "errorScope";

export const LocalErrorScopeApolloContext = { [ErrorScopeContextIdentifier]: ErrorScope.Local };

export const errorScopeForOperationContext = (context: any): ErrorScope => {
    const errorContext = context[ErrorScopeContextIdentifier];
    if (errorContext == ErrorScope.Local) {
        return ErrorScope.Local;
    }

    return ErrorScope.Global;
};
