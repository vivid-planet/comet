import { messages } from "@comet/admin";
import { Clear, Delete, OpenNewTab, Warning } from "@comet/admin-icons";
import { fontWeights } from "@comet/admin-theme";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface SaveConflictDialogProps {
    open: boolean;
    onClosePressed: () => void;
    onDiscardChangesPressed: () => void;
}

export const useStyles = makeStyles((theme) => ({
    iconContainer: {
        marginRight: 10,
    },
    fillSpace: {
        display: "flex",
        flex: 1,
    },
    discardButtonRoot: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        "&:hover": {
            backgroundColor: theme.palette.error.dark,
        },
    },
    errorAlert: {
        backgroundColor: "white",
        marginBottom: "20px",
        color: "black",
        fontWeight: fontWeights.fontWeightBold,
    },
}));

function SaveConflictDialog({ open, onClosePressed, onDiscardChangesPressed }: SaveConflictDialogProps): React.ReactElement {
    const styles = useStyles();

    return (
        <Dialog open={open} onClose={onClosePressed} maxWidth="md">
            <DialogTitle>
                <Typography>
                    <FormattedMessage id="comet.saveConflictDialog.title" defaultMessage="Save Conflict" />
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Alert variant="outlined" severity="error" icon={<Warning />} classes={{ root: styles.errorAlert }}>
                    <FormattedMessage id="comet.saveConflictDialog.description1" defaultMessage="There was a conflict while saving" />
                </Alert>

                <Box py={2}>
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

                <Box py={2}>
                    <Typography variant="h4" fontWeight="bold">
                        <FormattedMessage id="comet.saveConflictDialog.whatCanIDoNow.heading" defaultMessage="What can I do now?" />
                    </Typography>
                    <StyledList>
                        <StyledListItem>
                            <Typography>
                                <FormattedMessage
                                    id="comet.saveConflictDialog.whatCanIDoNow.option2"
                                    defaultMessage="View the other changes in a new tab: You must make your changes again in the new tab."
                                />
                            </Typography>
                        </StyledListItem>
                        <StyledListItem>
                            <Typography>
                                <FormattedMessage
                                    id="comet.saveConflictDialog.whatCanIDoNow.option1"
                                    defaultMessage="Discard your unsaved changes: All your changes will be lost."
                                />
                            </Typography>
                        </StyledListItem>
                    </StyledList>
                </Box>

                <Box py={2}>
                    <Typography variant="h4" fontWeight="bold">
                        <FormattedMessage id="comet.saveConflictDialog.avoidConflicts.heading" defaultMessage="How can I avoid conflicts?" />
                    </Typography>

                    <StyledList>
                        <StyledListItem>
                            <Typography>
                                <FormattedMessage
                                    id="comet.saveConflictDialog.avoidConflicts.tip1"
                                    defaultMessage="Avoid opening the same page in multiple tabs."
                                />
                            </Typography>
                        </StyledListItem>
                        <StyledListItem>
                            <Typography>
                                <FormattedMessage
                                    id="comet.saveConflictDialog.avoidConflicts.tip3"
                                    defaultMessage="Save your changes regularly. Don't leave a page open for a long time with unsaved changes."
                                />
                            </Typography>
                        </StyledListItem>
                        <StyledListItem>
                            <Typography>
                                <FormattedMessage
                                    id="comet.saveConflictDialog.avoidConflicts.tip2"
                                    defaultMessage="Avoid editing a page while another user is also editing it."
                                />
                            </Typography>
                        </StyledListItem>
                    </StyledList>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClosePressed} startIcon={<Clear />} color="info">
                    <FormattedMessage {...messages.close} />
                </Button>
                <div className={styles.fillSpace} />
                <Button
                    startIcon={<Delete />}
                    onClick={() => {
                        onClosePressed();
                        onDiscardChangesPressed();
                    }}
                    variant="contained"
                    classes={{ root: styles.discardButtonRoot }}
                    color="info"
                >
                    <FormattedMessage id="comet.saveConflictDialog.actionButtons.discardChanges" defaultMessage="Discard your changes" />
                </Button>
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
                        defaultMessage="View the other changes in a new Tab"
                    />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const StyledList = styled(List)`
    list-style-type: disc;
    padding-inline-start: ${({ theme }) => theme.spacing(6)};
`;

const StyledListItem = styled(ListItem)`
    display: list-item;
    padding-left: 0;
`;

export { SaveConflictDialog };
