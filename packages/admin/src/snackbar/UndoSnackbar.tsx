import { Button, Slide, Snackbar } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useSnackbarApi } from "./SnackbarProvider";

export interface SnackbarState<Payload extends unknown> {
    key: React.Key;
    message: React.ReactNode;
    onUndoClick?: (payload?: Payload) => void;
    payload?: Payload;
}

export const useUndoSnackbar = () => {
    const snackbarApi = useSnackbarApi();

    const handleActionButtonClick = <Payload,>(snackbarState?: SnackbarState<Payload>) => {
        snackbarApi.hideSnackbar();

        snackbarState?.onUndoClick?.(snackbarState?.payload);
    };

    const updateSnackbarState = <Payload extends unknown>(newState: SnackbarState<Payload>) => {
        snackbarApi.showSnackbar(
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                key={newState?.key}
                autoHideDuration={5000}
                message={newState?.message}
                action={
                    <Button color="secondary" size="small" onClick={() => handleActionButtonClick(newState)}>
                        <FormattedMessage id="cometAdmin.generic.undo" defaultMessage="Undo" />
                    </Button>
                }
                TransitionComponent={(props: TransitionProps) => <Slide {...props} direction="right" />}
            />,
        );
    };

    return {
        showUndoSnackbar: updateSnackbarState,
    };
};
