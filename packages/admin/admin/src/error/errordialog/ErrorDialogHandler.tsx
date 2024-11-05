import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";

import { ErrorDialog, ErrorDialogOptions } from "./ErrorDialog";
import { errorDialogVar } from "./errorDialogVar";

export const ErrorDialogHandler = () => {
    const errorOptions = useReactiveVar<ErrorDialogOptions | undefined>(errorDialogVar);

    const [errorDialogVisible, setErrorDialogVisible] = useState(false);

    useEffect(() => {
        setErrorDialogVisible(errorOptions != null);
    }, [errorOptions]);

    return (
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
    );
};
