import { Close } from "@comet/admin-icons";
import { Dialog, DialogContent, DialogTitle, IconButton, Link, Modal, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";

import { version } from "../../..";
import { BuildInformationContext } from "./build-information/BuildInformationContext";
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
    const buildInformation = React.useContext(BuildInformationContext);

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
                        <Typography classes={{ root: classes.version }}>{`v${version}`}</Typography>
                        {buildInformation?.number && buildInformation.commitHash && (
                            <Typography>
                                <FormattedMessage
                                    id="comet.version.title"
                                    defaultMessage="{buildNumber} ({commitSha})"
                                    values={{
                                        buildNumber: buildInformation.number,
                                        commitSha: buildInformation.commitHash,
                                    }}
                                />
                            </Typography>
                        )}
                        {buildInformation?.date && (
                            <Typography>
                                <FormattedDate value={buildInformation.date} /> <FormattedTime value={buildInformation.date} />
                            </Typography>
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
