<<<<<<< HEAD
import { Button, Slide, Snackbar, type SnackbarProps } from "@mui/material";
import { type SlideProps } from "@mui/material/Slide/Slide";
import { type ReactNode } from "react";
=======
import { Slide, Snackbar, SnackbarProps } from "@mui/material";
import { SlideProps } from "@mui/material/Slide/Slide";
import { ReactNode } from "react";
>>>>>>> main
import { FormattedMessage } from "react-intl";

import { Button } from "../common/buttons/Button";
import { messages } from "../messages";
import { useSnackbarApi } from "./SnackbarProvider";

export interface UndoSnackbarProps<Payload> extends Omit<SnackbarProps, "action"> {
    message: ReactNode;
    onUndoClick: (payload?: Payload) => void;
    payload?: Payload;
}

export const UndoSnackbar = <Payload,>({ onUndoClick, payload, ...props }: UndoSnackbarProps<Payload>) => {
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
                <Button variant="textDark" size="small" onClick={onClick}>
                    <FormattedMessage {...messages.undo} />
                </Button>
            }
            TransitionComponent={(props: SlideProps) => <Slide {...props} direction="right" />}
            {...props}
        />
    );
};
