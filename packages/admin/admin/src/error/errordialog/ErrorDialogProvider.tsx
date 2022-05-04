import { useReactiveVar } from "@apollo/client";
import * as React from "react";

import { ErrorDialog, ErrorDialogOptions } from "./ErrorDialog";
import { errorDialogVar } from "./errorDialogVar";

export const ErrorDialogProvider: React.FunctionComponent = ({ children }) => {
    const errorOptions = useReactiveVar<ErrorDialogOptions | undefined>(errorDialogVar);

    const [errorDialogVisible, setErrorDialogVisible] = React.useState(false);

    React.useEffect(() => {
        if (errorOptions && !errorDialogVisible) {
            setErrorDialogVisible(true);
        } else if (errorOptions == null && errorDialogVisible) {
            setErrorDialogVisible(false);
        }
    }, [errorDialogVisible, errorOptions]);

    return (
        <>
            {children}
            <ErrorDialog
                show={errorDialogVisible}
                errorOptions={errorOptions}
                onCloseClicked={() => {
                    setErrorDialogVisible(false);

                    setTimeout(() => {
                        errorDialogVar(undefined);
                    }, 200);
                }}
            />
        </>
    );
};
