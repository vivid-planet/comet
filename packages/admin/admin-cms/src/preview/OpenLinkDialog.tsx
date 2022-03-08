import { Domain } from "@comet/admin-icons";
import { Dialog, DialogContent, DialogTitle, Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

import { ExternalLinkBlockData } from "../blocks.generated";

interface OnlyShowVisibleContentModalProps {
    onClose?: () => void;
    open: boolean;
    link?: ExternalLinkBlockData;
}

const IconContainer = styled.div`
    margin-right: 10px;
`;
function OpenLinkDialog({ open, onClose, link }: OnlyShowVisibleContentModalProps): React.ReactElement {
    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
            <DialogTitle>
                <Grid container>
                    <Grid item>
                        <IconContainer>
                            <Domain />
                        </IconContainer>
                    </Grid>
                    <Grid item>
                        <Typography>
                            <FormattedMessage id={"comet.preview.openLink.title"} defaultMessage={"Open Link"} />
                        </Typography>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Typography>
                    <FormattedMessage
                        id={"comet.preview.openExternalLink.description"}
                        defaultMessage={'Do you want to open "{url}" in a new Browser tab?'}
                        values={{
                            url: link?.targetUrl,
                        }}
                    />
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    <FormattedMessage id="comet.generic.cancel" defaultMessage="Cancel" />
                </Button>

                <Button
                    onClick={() => {
                        onClose?.();
                        window.open(link?.targetUrl);
                    }}
                    variant={"contained"}
                    color="primary"
                >
                    <FormattedMessage id="comet.openLinkDialog.actionButtons.open" defaultMessage="Open" />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export { OpenLinkDialog };
