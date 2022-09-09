import { messages } from "@comet/admin";
import { Clear, Delete, OpenNewTab, Warning } from "@comet/admin-icons";
import { fontWeights } from "@comet/admin-theme";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
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
        <Dialog open={open} onClose={onClosePressed} maxWidth="sm">
            <DialogTitle>
                <Typography>
                    <FormattedMessage id="comet.saveConflictDialog.title" defaultMessage="Save Conflict" />
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Alert variant="outlined" severity="error" icon={<Warning />} classes={{ root: styles.errorAlert }}>
                    <FormattedMessage id="comet.saveConflictDialog.description1" defaultMessage="There was a conflict while saving" />
                </Alert>
                <Typography>
                    <FormattedMessage
                        id="comet.saveConflictDialog.description"
                        defaultMessage="Someone else saved a new version. Therefore this page cannot be saved now. You can open the changed page in a new tab to compare the changes."
                    />
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClosePressed} startIcon={<Clear />} color="info">
                    <FormattedMessage {...messages.cancel} />
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
                    <FormattedMessage id="comet.saveConflictDialog.actionButtons.discardChanges" defaultMessage="Discard" />
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
                        defaultMessage="Open current version in new Tab"
                    />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export { SaveConflictDialog };
