import { Close } from "@comet/admin-icons";
import { Dialog, DialogContent as MuiDialogContent, DialogTitle, IconButton, Link, Modal as MuiModal, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";

import { version } from "../../..";
import { useBuildInformation } from "./build-information/useBuildInformation";
import { CometDigitalExperienceLogo } from "./CometDigitalExperienceLogo";

interface AboutModalProps {
    onClose?: () => void;
    open: boolean;
    logo?: React.ReactElement;
}

export function AboutModal({ open, onClose, logo = <CometDigitalExperienceLogo /> }: AboutModalProps): React.ReactElement {
    const buildInformation = useBuildInformation();

    return (
        <Modal open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
            <Dialog open onClose={onClose}>
                <DialogTitle>
                    <DialogTitleContent>
                        <Typography>
                            <FormattedMessage id="comet.about.dialog.title" defaultMessage="About" />
                        </Typography>
                        <DialogTitleSpace />
                        <IconButton onClick={onClose} color="inherit" size="large">
                            <Close />
                        </IconButton>
                    </DialogTitleContent>
                </DialogTitle>
                <DialogContent>
                    {logo}
                    <VersionContainer>
                        <Typography fontWeight={500}>{`v${version}`}</Typography>
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
                    </VersionContainer>
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

const Modal = styled(MuiModal)`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const DialogTitleContent = styled("div")`
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
`;

const DialogTitleSpace = styled("div")`
    display: flex;
    flex: 1;
`;

const DialogContent = styled(MuiDialogContent)`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const VersionContainer = styled("div")`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 40px;
    margin-bottom: 40px;
`;
