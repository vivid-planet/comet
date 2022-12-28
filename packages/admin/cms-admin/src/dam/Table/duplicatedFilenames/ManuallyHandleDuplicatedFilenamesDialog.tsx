import { Warning } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, List, ListItem, ListItemText, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
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

const InstructionWrapper = styled("div")`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(1)};
`;

const WarningIcon = styled(Warning)`
    color: ${({ theme }) => theme.palette.error.main};
    font-size: 20px;
`;

interface DuplicateFilenameDialogProps {
    open: boolean;
    filenameData: FilenameData[];
    onSkip: () => void;
    onUpload: () => void;
}

export const ManuallyHandleDuplicatedFilenamesDialog: React.VoidFunctionComponent<DuplicateFilenameDialogProps> = ({
    open,
    filenameData,
    onSkip,
    onUpload,
}) => {
    return (
        <Dialog open={open}>
            <DialogTitle>
                <FormattedMessage
                    id="comet.dam.duplicateFilenameDialog.title"
                    defaultMessage="Duplicate {count, plural, one {filename} other {filenames}}"
                    values={{ count: filenameData.length }}
                />
            </DialogTitle>
            <DialogContent>
                <InstructionWrapper>
                    <WarningIcon />
                    <Typography variant="h5" component="h3">
                        <FormattedMessage
                            id="comet.dam.duplicateFilenameDialog.introduction"
                            defaultMessage="The following filenames already exist:"
                        />
                    </Typography>
                </InstructionWrapper>

                <StyledList>
                    {filenameData.map((data, index) => {
                        return (
                            <React.Fragment key={data.name}>
                                {index === 0 && <Divider component="li" />}
                                <StyledListItem key={data.name}>
                                    <ListItemText primary={<Typography variant="body1">{data.name}</Typography>} />
                                </StyledListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        );
                    })}
                </StyledList>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onSkip}>
                    <FormattedMessage
                        id="comet.dam.duplicateFilenameDialog.action.skip"
                        defaultMessage="Skip {count, plural, one {file} other {files}}"
                        values={{
                            count: filenameData.length,
                        }}
                    />
                </Button>
                <Button variant="contained" color="primary" onClick={onUpload}>
                    <FormattedMessage
                        id="comet.dam.duplicateFilenameDialog.action.uploadAsCopy"
                        defaultMessage="Upload as {count, plural, one {copy} other {copies}}"
                        values={{
                            count: filenameData.length,
                        }}
                    />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
