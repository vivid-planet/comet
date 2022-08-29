import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { FileData } from "./DuplicatedFilenamesResolver";

const StyledList = styled(List)`
    margin-top: ${({ theme }) => theme.spacing(4)};
    background: white;
    padding: 0;
`;

const StyledListItem = styled(ListItem)`
    padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
`;

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
                <Typography variant="h5" component="h3">
                    <FormattedMessage id="comet.dam.duplicateFilenameDialog.introduction" defaultMessage="The following filenames already exist:" />
                </Typography>

                <StyledList>
                    {fileData.map((data, index) => {
                        return (
                            <>
                                {index === 0 && <Divider component="li" />}
                                <StyledListItem key={data.file.name}>
                                    <ListItemText primary={<Typography variant="body1">{data.file.name}</Typography>} />
                                </StyledListItem>
                                <Divider component="li" />
                            </>
                        );
                    })}
                </StyledList>
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
