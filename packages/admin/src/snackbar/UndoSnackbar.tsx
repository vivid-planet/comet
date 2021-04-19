import { Button, Slide, Snackbar, SnackbarCloseReason } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useSnackbarApi } from "./SnackbarProvider";

export interface SnackbarState<Payload extends unknown> {
    key: React.Key;
    message: React.ReactNode;
    onActionButtonClick?: (payload?: Payload) => void;
    payload?: Payload;
}

export const useUndoSnackbar = () => {
    const snackbarApi = useSnackbarApi();
    const [snackbarState, setSnackbarState] = React.useState<SnackbarState<unknown>>();

    const updateSnackbarState = <Payload extends unknown>(newState: SnackbarState<Payload>) => {
        setSnackbarState(newState);
    };

    const handleClose = (event: React.SyntheticEvent, reason: SnackbarCloseReason) => {
        if (reason === "clickaway") {
            return;
        }

        setSnackbarState(undefined);
    };

    const handleActionButtonClick = <Payload,>(snackbarState?: SnackbarState<Payload>) => {
        setSnackbarState(undefined);

        snackbarState?.onActionButtonClick?.(snackbarState?.payload);
    };

    React.useEffect(() => {
        snackbarApi.showSnackbar(
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                open={Boolean(snackbarState)}
                key={snackbarState?.key}
                autoHideDuration={5000}
                onClose={handleClose}
                message={snackbarState?.message}
                action={
                    <Button color="secondary" size="small" onClick={() => handleActionButtonClick(snackbarState)}>
                        <FormattedMessage id="cometAdmin.generic.undo" defaultMessage="Undo" />
                    </Button>
                }
                TransitionComponent={(props: TransitionProps) => <Slide {...props} direction="right" />}
            />,
        );
    }, [snackbarApi, snackbarState]);

    return {
        showUndoSnackbar: updateSnackbarState,
    };
};
