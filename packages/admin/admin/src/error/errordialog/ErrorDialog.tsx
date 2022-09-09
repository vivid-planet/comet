import { KeyboardArrowDown } from "@mui/icons-material";
import { Dialog, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "../../messages";

export interface ErrorDialogOptions {
    error: string;
    title?: React.ReactNode;
    userMessage?: React.ReactNode;
}

export type ErrorMethods = {
    setError: (options: ErrorDialogOptions) => void;
};

export interface ErrorDialogProps {
    show?: boolean;
    onCloseClicked?: () => void;
    errorOptions?: ErrorDialogOptions;
}

export const ErrorDialog: React.FunctionComponent<ErrorDialogProps> = ({ show = false, onCloseClicked, errorOptions }) => {
    const intl = useIntl();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    if (!errorOptions) {
        return null;
    }

    // Destructuring and default values
    const {
        title = intl.formatMessage({ id: "comet.errorDialog.title", defaultMessage: "Error" }),
        userMessage = intl.formatMessage({ id: "comet.errorDialog.abstractUserMessage", defaultMessage: "An error occured" }),
        error,
    } = errorOptions;

    return (
        <Dialog open={show} onClose={onCloseClicked} fullScreen={fullScreen}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText component="div">
                    {userMessage}
                    {process.env.NODE_ENV === "development" && (
                        <Accordion>
                            <AccordionSummary expandIcon={<KeyboardArrowDown />}>
                                <FormattedMessage id="comet.errorDialog.Details" defaultMessage="Details" />
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{error}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseClicked} color="primary" variant="contained">
                    <FormattedMessage {...messages.ok} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
