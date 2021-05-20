import { Button, Slide, Snackbar, SnackbarProps } from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { useSnackbarApi } from "./SnackbarProvider";

export interface UndoSnackbarProps<Payload extends unknown> extends Omit<SnackbarProps, "action"> {
    key: React.Key;
    message: React.ReactNode;
    onUndoClick: (payload?: Payload) => void;
    payload?: Payload;
}

const UndoSnackbar = <Payload extends unknown>({ onUndoClick, payload, ...props }: UndoSnackbarProps<Payload>) => {
    const snackbarApi = useSnackbarApi();

    const onClick = () => {
        snackbarApi.hideSnackbar();
        onUndoClick(payload);
    };

    return (
        <Snackbar
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

export default UndoSnackbar;
