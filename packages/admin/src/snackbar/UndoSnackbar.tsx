import { Button, Slide, Snackbar, SnackbarProps } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { usePersistedStateId } from "..";
import { useSnackbarApi } from "./SnackbarProvider";

export interface UndoSnackbarProps<Payload extends unknown> extends Omit<SnackbarProps, "action"> {
    message: React.ReactNode;
    onUndoClick: (payload?: Payload) => void;
    payload?: Payload;
}

export const UndoSnackbar = <Payload extends unknown>({ onUndoClick, payload, ...props }: UndoSnackbarProps<Payload>) => {
    const snackbarApi = useSnackbarApi();
    const id = usePersistedStateId();

    const onClick = () => {
        snackbarApi.hideSnackbar();
        onUndoClick(payload);
    };

    return (
        <Snackbar
            key={id}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            autoHideDuration={5000}
            action={
                <Button color="secondary" size="small" onClick={onClick}>
                    <FormattedMessage id="cometAdmin.generic.undo" defaultMessage="Undo" />
                </Button>
            }
            TransitionComponent={(props: TransitionProps) => <Slide {...props} direction="right" />}
            {...props}
        />
    );
};
