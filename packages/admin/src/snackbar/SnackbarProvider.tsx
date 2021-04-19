import { Button, Slide, Snackbar } from "@material-ui/core";
import { SnackbarCloseReason } from "@material-ui/core/Snackbar/Snackbar";
import { TransitionProps } from "@material-ui/core/transitions";
import * as React from "react";

export interface SnackbarState<Payload extends unknown> {
    key: React.Key;
    message: React.ReactNode;
    actionButtonLabel?: React.ReactNode;
    onActionButtonClick?: (payload?: Payload) => void;
    payload?: Payload;
}

export interface SnackbarApi {
    showSnackbar: <Payload extends unknown>(newState: SnackbarState<Payload>) => void;
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
    const [snackbarState, setSnackbarState] = React.useState<SnackbarState<unknown>>();

    const updateSnackbarState = <Payload extends unknown>({ ...newState }: SnackbarState<Payload>) => {
        setSnackbarState({ ...newState });
    };

    const handleClose = React.useCallback((event: React.SyntheticEvent, reason: SnackbarCloseReason) => {
        if (reason === "clickaway") {
            return;
        }

        setSnackbarState(undefined);
    }, []);

    const handleActionButtonClick = React.useCallback(() => {
        setSnackbarState(undefined);

        snackbarState?.onActionButtonClick?.(snackbarState?.payload);
    }, [snackbarState]);

    return (
        <SnackbarContext.Provider
            value={{
                showSnackbar: updateSnackbarState,
            }}
        >
            {children}
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                open={Boolean(snackbarState)}
                key={snackbarState?.key}
                autoHideDuration={5000}
                onClose={handleClose}
                message={snackbarState?.message}
                action={
                    snackbarState?.actionButtonLabel && (
                        <Button color="secondary" size="small" onClick={handleActionButtonClick}>
                            {snackbarState?.actionButtonLabel}
                        </Button>
                    )
                }
                TransitionComponent={(props: TransitionProps) => <Slide {...props} direction="right" />}
            />
        </SnackbarContext.Provider>
    );
};
