import { Close } from "@comet/admin-icons";
import { Dialog, DialogContent, DialogTitle, IconButton, Link, Modal, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";

import { CometDigitalExperienceLogo } from "./CometDigitalExperienceLogo";

const useStyles = makeStyles(() => ({
    content: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    dialogTitle: {
        display: "flex",
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
    },
    spaceBetween: {
        display: "flex",
        flex: 1,
    },
    versionContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        marginTop: 40,
        marginBottom: 40,
    },
    version: {
        fontWeight: 500,
    },
}));

interface AboutModalProps {
    onClose?: () => void;
    open: boolean;
}
function AboutModal({ open, onClose }: AboutModalProps): React.ReactElement {
    const classes = useStyles();

    return (
        <Modal className={classes.modal} open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
            <Dialog open onClose={onClose}>
                <DialogTitle>
                    <div className={classes.dialogTitle}>
                        <Typography>
                            <FormattedMessage id="comet.about.dialog.title" defaultMessage="About" />
                        </Typography>

                        <div className={classes.spaceBetween} />
                        <IconButton onClick={onClose} color="inherit" size="large">
                            <Close />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent classes={{ root: classes.content }}>
                    <CometDigitalExperienceLogo />

                    <div className={classes.versionContainer}>
                        <div>
                            <Typography classes={{ root: classes.version }}>
                                <FormattedMessage
                                    id="comet.version.title"
                                    defaultMessage="Version: {buildNumber} ({commitSha})"
                                    values={{
                                        buildNumber: process.env.BUILD_NUMBER,
                                        commitSha: process.env.COMMIT_SHA !== "" ? process.env.COMMIT_SHA : "unknown",
                                    }}
                                />
                            </Typography>
                        </div>
                        {process.env.BUILD_DATE != "" && (
                            <div>
                                <Typography>
                                    <FormattedDate value={process.env.BUILD_DATE} /> <FormattedTime value={process.env.BUILD_DATE} />
                                </Typography>
                            </div>
                        )}
                    </div>
                    <Typography>
                        <FormattedMessage id="comet.about.dialog.copyright" defaultMessage="Copyright © Vivid Planet Software GmbH" />
                    </Typography>

                    <Link href="https://www.vivid-planet.com" target="_blank" underline="hover">
                        {/* eslint-disable-next-line @calm/react-intl/missing-formatted-message */}
                        <Typography>www.vivid-planet.com</Typography>
                    </Link>
                </DialogContent>
            </Dialog>
        </Modal>
    );
}

export { AboutModal };
