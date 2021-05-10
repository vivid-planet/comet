import { SnackbarCloseReason, SnackbarProps } from "@material-ui/core";
import * as React from "react";

export interface SnackbarApi {
    showSnackbar: (newSnackbar: React.ReactElement<SnackbarProps>) => void;
    hideSnackbar: () => void;
}

const SnackbarContext = React.createContext<SnackbarApi | null>(null);

export const useSnackbarApi = () => {
    const context = React.useContext(SnackbarContext);

    if (context === null) {
        throw new Error("No snackbar context found. Please ensure that you have called `SnackbarProvider` higher up in your tree.");
    }

    return context;
};

export const SnackbarProvider: React.FunctionComponent = ({ children }) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [snackbar, setSnackbar] = React.useState<React.ReactElement>();

    const updateSnackbar = (newSnackbar: React.ReactElement) => {
        setSnackbar(newSnackbar);
        if (newSnackbar !== undefined) {
            setOpen(true);
        }
    };

    const hideSnackbar = () => {
        setOpen(false);
        // setTimeout is needed, otherwise the onClose event is not triggered
        setTimeout(() => {
            setSnackbar(undefined);
        }, 0);
    };

    const handleClose = (
        event: React.SyntheticEvent,
        reason: SnackbarCloseReason,
        onClose?: (event: React.SyntheticEvent, reason: SnackbarCloseReason) => void,
    ) => {
        if (reason === "timeout") {
            hideSnackbar();
        }

        onClose?.(event, reason);
    };

    return (
        <SnackbarContext.Provider
            value={{
                showSnackbar: updateSnackbar,
                hideSnackbar: hideSnackbar,
            }}
        >
            {children}
            {snackbar !== undefined &&
                React.cloneElement<SnackbarProps>(snackbar, {
                    open: open,
                    onClose: (event, reason) => handleClose(event, reason, snackbar?.props.onClose),
                })}
        </SnackbarContext.Provider>
    );
};
