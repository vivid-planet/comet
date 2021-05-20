import * as React from "react";

import { ErrorDialog, ErrorDialogOptions } from "./ErrorDialog";
import { ErrorDialogContext, ErrorDialogContextProps } from "./ErrorDialogContext";

export const ErrorDialogProvider: React.FunctionComponent = ({ children }) => {
    const [errorOptions, setErrorOptions] = React.useState<ErrorDialogOptions | undefined>(undefined);
    const [errorDialogVisible, setErrorDialogVisible] = React.useState(false);

    const errorDialog = React.useMemo((): ErrorDialogContextProps => {
        return {
            showError: (options: ErrorDialogOptions) => {
                setErrorOptions(options);
                setErrorDialogVisible(true);
            },
        };
    }, [setErrorOptions]);

    return (
        <ErrorDialogContext.Provider value={errorDialog}>
            {children}
            <ErrorDialog
                show={errorDialogVisible}
                errorOptions={errorOptions}
                onCloseClicked={() => {
                    setErrorDialogVisible(false);

                    setTimeout(() => {
                        setErrorOptions(undefined); // delay cleaning error so Dialog Content does not go away while fadeout transition
                    }, 200);
                }}
            />
        </ErrorDialogContext.Provider>
    );
};
