import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { FileData } from "./DuplicatedFilenamesResolver";

interface DuplicateFilenameDialogProps {
    open: boolean;
    fileData: FileData[];
    onSkip: () => void;
    onUpload: () => void;
}

export const DuplicatedFilenameDialog: React.VoidFunctionComponent<DuplicateFilenameDialogProps> = ({ open, fileData, onSkip, onUpload }) => {
    return (
        <Dialog open={open}>
            <DialogTitle>
                <FormattedMessage
                    id="comet.dam.duplicateFilenameDialog.title"
                    defaultMessage="Duplicate {count, plural, one {filename} other {filenames}}"
                    values={{ count: fileData.length }}
                />
            </DialogTitle>
            <DialogContent>
                <Typography variant="h4">
                    <FormattedMessage id="comet.dam.duplicateFilenameDialog.introduction" defaultMessage="The following filenames already exist:" />
                </Typography>

                <List>
                    {fileData.map((data) => {
                        return <ListItem key={data.file.name}>{data.file.name}</ListItem>;
                    })}
                </List>
            </DialogContent>
            <DialogActions>
                <Button type="submit" variant="contained" color="primary" onClick={onSkip}>
                    <FormattedMessage
                        id="comet.dam.duplicateFilenameDialog.action.skip"
                        defaultMessage="Skip {count, plural, one {file} other {files}}"
                        values={{
                            count: fileData.length,
                        }}
                    />
                </Button>
                <Button type="submit" variant="contained" color="primary" onClick={onUpload}>
                    <FormattedMessage
                        id="comet.dam.duplicateFilenameDialog.action.uploadAsCopy"
                        defaultMessage="Upload as {count, plural, one {copy} other {copies}}"
                        values={{
                            count: fileData.length,
                        }}
                    />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
