import { Alert } from "@comet/admin";
import { Duplicate, Forward, Save } from "@comet/admin-icons";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Fragment } from "react";
import { FormattedMessage } from "react-intl";

import { FilenameData } from "./ManualDuplicatedFilenamesHandler";

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
    filenameData: FilenameData[];
    onSkip: () => void;
    onUpload: () => void;
    onReplace: () => void;
}

export const ManuallyHandleDuplicatedFilenamesDialog: React.VoidFunctionComponent<DuplicateFilenameDialogProps> = ({
    open,
    filenameData,
    onSkip,
    onUpload,
    onReplace,
}) => {
    return (
        <Dialog open={open} fullWidth maxWidth="lg">
            <DialogTitle>
                <FormattedMessage
                    id="comet.dam.duplicateFilenameDialog.title"
                    defaultMessage="Duplicate {count, plural, one {filename} other {filenames}}"
                    values={{ count: filenameData.length }}
                />
            </DialogTitle>
            <DialogContent>
                <Alert
                    severity="warning"
                    title={
                        <FormattedMessage
                            id="comet.dam.duplicateFilenameDialog.actionAlert"
                            defaultMessage="The following {count, plural, one {filename} other {filenames}} already {count, plural, one {exists} other {exist}}. Please choose an action:"
                            values={{ count: filenameData.length }}
                        />
                    }
                >
                    <Typography variant="list">
                        <Typography variant="listItem" sx={{ fontSize: 14 }}>
                            <FormattedMessage
                                id="comet.dam.duplicateFilenameDialog.skipDescription"
                                defaultMessage="<strong>Skip:</strong> Skip uploading duplicates. All other files will be uploaded as usual."
                                values={{ strong: (chunks) => <strong>{chunks}</strong> }}
                            />
                        </Typography>

                        <Typography variant="listItem" sx={{ fontSize: 14 }}>
                            <FormattedMessage
                                id="comet.dam.duplicateFilenameDialog.replaceDescription"
                                defaultMessage="<strong>Replace:</strong> Replace existing files with duplicates. <strong>Attention:</strong> This will not affect image cropping settings."
                                values={{ strong: (chunks) => <strong>{chunks}</strong> }}
                            />
                        </Typography>

                        <Typography variant="listItem" sx={{ fontSize: 14 }}>
                            <FormattedMessage
                                id="comet.dam.duplicateFilenameDialog.saveAsCopyDescription"
                                defaultMessage="<strong>Save as copy:</strong> Upload duplicates as new files with “copy” added to the end of the file names."
                                values={{ strong: (chunks) => <strong>{chunks}</strong> }}
                            />
                        </Typography>
                    </Typography>
                </Alert>

                <StyledList>
                    {filenameData.map((data, index) => {
                        return (
                            <Fragment key={data.name}>
                                {index === 0 && <Divider component="li" />}
                                <StyledListItem key={data.name}>
                                    <ListItemText primary={<Typography variant="body1">{data.name}</Typography>} />
                                </StyledListItem>
                                <Divider component="li" />
                            </Fragment>
                        );
                    })}
                </StyledList>
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Button variant="text" color="secondary" onClick={onSkip} startIcon={<Forward />}>
                        <FormattedMessage
                            id="comet.dam.duplicateFilenameDialog.action.skip"
                            defaultMessage="Skip {count, plural, one {file} other {files}}"
                            values={{
                                count: filenameData.length,
                            }}
                        />
                    </Button>
                    <Box>
                        <Button variant="outlined" onClick={onReplace} startIcon={<Duplicate />} sx={{ marginRight: "10px" }}>
                            <FormattedMessage
                                id="comet.dam.duplicateFilenameDialog.action.replaceFiles"
                                defaultMessage="Replace {count, plural, one {file} other {files}}"
                                values={{
                                    count: filenameData.length,
                                }}
                            />
                        </Button>
                        <Button variant="contained" color="primary" onClick={onUpload} startIcon={<Save />}>
                            <FormattedMessage
                                id="comet.dam.duplicateFilenameDialog.action.uploadAsCopy"
                                defaultMessage="Upload as {count, plural, one {copy} other {copies}}"
                                values={{
                                    count: filenameData.length,
                                }}
                            />
                        </Button>
                    </Box>
                </Box>
            </DialogActions>
        </Dialog>
    );
};
