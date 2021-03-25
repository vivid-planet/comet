import { Box, Dialog, Typography } from "@material-ui/core";
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
import { Error, KeyboardArrowDown } from "@material-ui/icons";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ErrorDialogOptions {
    error: string;
    title?: string;
    userMessage?: string;
}

export type ErrorMethods = {
    setError: (options: ErrorDialogOptions) => void;
};

export interface ErrorProps {}

const ErrorDialog: React.ForwardRefRenderFunction<ErrorMethods, ErrorProps> = (props, ref) => {
    const [errorOptions, setErrorOptions] = React.useState<ErrorDialogOptions | null>(null);
    const [errorVisible, setErrorVisible] = React.useState<boolean>(false);

    const intl = useIntl();

    React.useImperativeHandle(ref, () => ({
        setError(options: ErrorDialogOptions) {
            setErrorOptions(options);
            setErrorVisible(true);
        },
    }));

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    if (!errorOptions) {
        return null;
    }

    const handleClose = () => {
        setErrorVisible(false);

        setTimeout(() => {
            setErrorOptions(null); // delay cleaning error so Dialog Content does not go away while fadeout transition
        }, 200);
    };

    // Destructuring and default values
    const {
        title = intl.formatMessage({ id: "comet.errorDialog.title", defaultMessage: "Error" }),
        userMessage = intl.formatMessage({ id: "comet.errorDialog.abstractUserMessage", defaultMessage: "An error occured" }),
        error,
    } = errorOptions;

    return (
        <Dialog open={errorVisible} onClose={handleClose} fullScreen={fullScreen}>
            <DialogTitle>
                <Box display={"flex"} flexDirection={"row"}>
                    <Error />
                    <Typography>{title}</Typography>
                </Box>
            </DialogTitle>
            <DialogContent style={{ minWidth: 300 }}>
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
                <Button onClick={handleClose} color="primary">
                    <FormattedMessage id="comet.generic.ok" defaultMessage="Ok" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ForwardedErrorDialog = React.forwardRef(ErrorDialog);
export default ForwardedErrorDialog;

export type ErrorDialogComponentRefType = React.ElementRef<typeof ForwardedErrorDialog>;
