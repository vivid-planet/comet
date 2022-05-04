import { useReactiveVar } from "@apollo/client";
import * as React from "react";

import { ErrorDialog, ErrorDialogOptions } from "./ErrorDialog";
import { errorDialogVar } from "./errorDialogVar";

export const ErrorDialogProvider: React.FunctionComponent = ({ children }) => {
    const errorOptions = useReactiveVar<ErrorDialogOptions | undefined>(errorDialogVar);

    const [errorDialogVisible, setErrorDialogVisible] = React.useState(false);

    React.useEffect(() => {
        setErrorDialogVisible(errorOptions != null);
    }, [errorOptions]);

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
