import { CancelButton } from "@comet/admin";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface DuplicateFilenameDialogProps {
    open: boolean;
    currentFilename?: string;
    suggestedFilename?: string;
    onCancel: () => void;
    onRename: (newFilename: string) => void;
}

export const DuplicatedFilenameDialog: React.VoidFunctionComponent<DuplicateFilenameDialogProps> = ({
    open,
    currentFilename,
    suggestedFilename,
    onCancel,
    onRename,
}) => {
    const [newFilename, setNewFilename] = React.useState<string>(suggestedFilename ?? "");

    return (
        <Dialog open={open}>
            <DialogTitle>
                <FormattedMessage id="comet.dam.duplicateFilenameDialog.title" defaultMessage="Duplicate filename" />
            </DialogTitle>
            <DialogContent>
                <Typography style={{ paddingBottom: "16px" }} variant="body1">
                    <FormattedMessage
                        id="comet.dam.duplicateFilenameDialog.heading"
                        defaultMessage="A file with the name {filename} already exists. Do you want to rename it?"
                        values={{
                            filename: currentFilename,
                        }}
                    />
                </Typography>
                <Input
                    defaultValue={newFilename}
                    onChange={(event) => {
                        setNewFilename(event.target.value);
                    }}
                    disableUnderline
                />
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={onCancel} />
                <Button variant="contained" color="primary" onClick={() => onRename(newFilename)}>
                    <FormattedMessage id="comet.generic.rename" defaultMessage="Rename" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
