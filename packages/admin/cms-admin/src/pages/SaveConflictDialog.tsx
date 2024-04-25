import { Alert, messages } from "@comet/admin";
import { Clear, Delete, OpenNewTab } from "@comet/admin-icons";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface SaveConflictDialogProps {
    open: boolean;
    onClosePressed: () => void;
    onDiscardChangesPressed: () => void;
}

function SaveConflictDialog({ open, onClosePressed, onDiscardChangesPressed }: SaveConflictDialogProps): React.ReactElement {
    return (
        <Dialog open={open} onClose={onClosePressed} maxWidth="md">
            <DialogTitle>
                <Typography>
                    <FormattedMessage id="comet.saveConflictDialog.title" defaultMessage="Save Conflict" />
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Alert severity="error">
                    <FormattedMessage id="comet.saveConflictDialog.description1" defaultMessage="There was a conflict while saving" />
                </Alert>

                <Stack spacing={2} pt={2}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            <FormattedMessage id="comet.saveConflictDialog.whatHappened.heading" defaultMessage="What happened?" />
                        </Typography>
                        <Typography py={2}>
                            <FormattedMessage
                                id="comet.saveConflictDialog.whatHappened.description"
                                defaultMessage="Someone else made changes to this page while you were editing it. <strong>You can't save this page.</strong> Otherwise, your changes would overwrite the other changes."
                                values={{ strong: (chunks: string) => <strong>{chunks}</strong> }}
                            />
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            <FormattedMessage id="comet.saveConflictDialog.whatCanIDoNow.heading" defaultMessage="What can I do now?" />
                        </Typography>
                        <Typography variant="list">
                            <Typography variant="listItem">
                                <FormattedMessage
                                    id="comet.saveConflictDialog.whatCanIDoNow.option2"
                                    defaultMessage="View the other changes in a new tab: You must make your changes again in the new tab."
                                />
                            </Typography>
                            <Typography variant="listItem">
                                <FormattedMessage
                                    id="comet.saveConflictDialog.whatCanIDoNow.option1"
                                    defaultMessage="Discard your unsaved changes: All your changes will be lost."
                                />
                            </Typography>
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            <FormattedMessage id="comet.saveConflictDialog.avoidConflicts.heading" defaultMessage="How can I avoid conflicts?" />
                        </Typography>

                        <Typography variant="list">
                            <Typography variant="listItem">
                                <FormattedMessage
                                    id="comet.saveConflictDialog.avoidConflicts.tip1"
                                    defaultMessage="Avoid opening the same page in multiple tabs."
                                />
                            </Typography>
                            <Typography variant="listItem">
                                <FormattedMessage
                                    id="comet.saveConflictDialog.avoidConflicts.tip3"
                                    defaultMessage="Save your changes regularly. Don't leave a page open for a long time with unsaved changes."
                                />
                            </Typography>
                            <Typography variant="listItem">
                                <FormattedMessage
                                    id="comet.saveConflictDialog.avoidConflicts.tip2"
                                    defaultMessage="Avoid editing a page while another user is also editing it."
                                />
                            </Typography>
                        </Typography>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClosePressed} startIcon={<Clear />} color="info">
                    <FormattedMessage {...messages.close} />
                </Button>
                <DialogActionsSpacer />
                <DiscardButton
                    startIcon={<Delete />}
                    onClick={() => {
                        onClosePressed();
                        onDiscardChangesPressed();
                    }}
                    variant="contained"
                    color="info"
                >
                    <FormattedMessage id="comet.saveConflictDialog.actionButtons.discardChanges" defaultMessage="Discard your changes" />
                </DiscardButton>
                <Button
                    startIcon={<OpenNewTab />}
                    onClick={() => {
                        onClosePressed();
                        window.open(window.location.href, "_blank");
                    }}
                    variant="contained"
                    color="primary"
                >
                    <FormattedMessage
                        id="comet.saveConflictDialog.actionButtons.openCurrentVersionInNewTab"
                        defaultMessage="View the other changes in a new tab"
                    />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const DialogActionsSpacer = styled("div")`
    flex: 1;
`;

const DiscardButton = styled(Button)`
    background-color: ${({ theme }) => theme.palette.error.main};
    color: ${({ theme }) => theme.palette.error.contrastText};

    &:hover {
        background-color: ${({ theme }) => theme.palette.error.dark};
    }
`;

export { SaveConflictDialog };
