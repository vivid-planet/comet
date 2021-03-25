import * as React from "react";

import ErrorDialog, { ErrorDialogComponentRefType, ErrorDialogOptions } from "./ErrorDialog";
import { ErrorDialogContext } from "./ErrorDialogContext";

export const ErrorDialogProvider: React.FunctionComponent = ({ children }) => {
    const errorDialogRef = React.useRef<ErrorDialogComponentRefType>(null);

    const showError = (options: ErrorDialogOptions) => {
        if (errorDialogRef?.current) {
            errorDialogRef.current?.setError(options);
        }
    };

    return (
        <ErrorDialogContext.Provider value={{ showError }}>
            {children}
            <ErrorDialog ref={errorDialogRef} />
        </ErrorDialogContext.Provider>
    );
};
