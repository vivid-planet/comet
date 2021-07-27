import { Dialog, Typography } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { KeyboardArrowDown } from "@material-ui/icons";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

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
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
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
                <DialogContentText>
                    {userMessage}
                    {process.env.NODE_ENV === "development" && (
                        <Accordion>
                            <AccordionSummary expandIcon={<KeyboardArrowDown />}>
                                <FormattedMessage id={"comet.errorDialog.Details"} defaultMessage={"Details"} />
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
                    <FormattedMessage id="comet.generic.ok" defaultMessage="Ok" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
