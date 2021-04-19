import { Snackbar, SnackbarCloseReason, SnackbarProps } from "@material-ui/core";
import * as React from "react";

type SnackbarPropsWithoutOpen = Omit<SnackbarProps, "open">;

export interface SnackbarApi {
    showSnackbar: (newSnackbarProps: SnackbarPropsWithoutOpen) => void;
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
    const [snackbarProps, setSnackbarProps] = React.useState<SnackbarPropsWithoutOpen>();

    const updateSnackbar = (newSnackbarProps: SnackbarPropsWithoutOpen) => {
        setSnackbarProps(newSnackbarProps);
    };

    const hideSnackbar = () => {
        setSnackbarProps(undefined);
    };

    const handleClose = (
        event: React.SyntheticEvent,
        reason: SnackbarCloseReason,
        onClose?: (event: React.SyntheticEvent, reason: SnackbarCloseReason) => void,
    ) => {
        if (reason === "timeout") {
            setSnackbarProps(undefined);
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
            <Snackbar
                {...snackbarProps}
                open={Boolean(snackbarProps)}
                onClose={(event, reason) => handleClose(event, reason, snackbarProps?.onClose)}
            />
        </SnackbarContext.Provider>
    );
};
