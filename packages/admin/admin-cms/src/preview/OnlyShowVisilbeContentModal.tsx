import { Button, Modal, Paper, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    paper: {
        padding: theme.spacing(5),
        minWidth: 300,
        maxWidth: 500,
        "& h3": {
            marginBottom: 20,
        },
        "& p": {
            marginBottom: 10,
        },
    },

    backdropCutout: {
        position: "absolute",
        bottom: -50,
        right: -50,
        backgroundColor: "white",
        width: 150,
        height: 150,
        borderRadius: 75,
        opacity: 0.25,
    },
    buttonContainer: {
        marginTop: 20,
    },
}));
interface OnlyShowVisibleContentModalProps {
    onClose?: () => void;
    open: boolean;
}
function OnlyShowVisibleContentModal({ open, onClose }: OnlyShowVisibleContentModalProps): React.ReactElement {
    const classes = useStyles();
    return (
        <Modal className={classes.modal} open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
            <Fade in={open}>
                <>
                    <Paper classes={{ root: classes.paper }}>
                        <Typography variant={"h3"}>
                            <FormattedMessage
                                id={"comet.sitePreview.hint.showOnlyVisibleContentActivated.title"}
                                defaultMessage={"Show only visible Content"}
                            />
                        </Typography>

                        <Typography>
                            <FormattedMessage
                                id={"comet.sitePreview.hint.showOnlyVisibleContentActivated.description"}
                                defaultMessage={"The site preview displays hidden sites and hidden blocks by default."}
                            />
                        </Typography>

                        <Typography>
                            <FormattedMessage
                                id={"comet.sitePreview.hint.showOnlyVisibleContentActivated.description2"}
                                defaultMessage={
                                    "If one wants to preview the site in a real online state, one can activate 'show only visible content' at the right side of the preview bar. Hidden blocks will not be displayed anymore."
                                }
                            />
                        </Typography>

                        <Typography>
                            <b>
                                <FormattedMessage
                                    id={"comet.sitePreview.hint.showOnlyVisibleContentActivated.description2"}
                                    defaultMessage={
                                        "Be aware, that if a site or it's parent is deactivated, the site preview will not be rendered it, because it is not online available."
                                    }
                                />
                            </b>
                        </Typography>

                        <div className={classes.buttonContainer}>
                            <Button variant={"contained"} color={"primary"} onClick={onClose}>
                                <FormattedMessage
                                    id={"comet.sitePreview.hint.showOnlyVisibleContentActivated.closeButton.title"}
                                    defaultMessage={"Close"}
                                />
                            </Button>
                        </div>
                    </Paper>
                    <div className={classes.backdropCutout} />
                </>
            </Fade>
        </Modal>
    );
}

export { OnlyShowVisibleContentModal };
