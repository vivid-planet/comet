import { messages } from "@comet/admin";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { FileUploadValidationError } from "./useDamFileUpload";

const Path = styled(Typography)`
    color: ${({ theme }) => theme.palette.grey[300]};
`;

const TableHeadCell = styled(TableCell)`
    &.MuiTableCell-head:not(:first-of-type):not(:empty):before {
        background-color: transparent;
    }
`;

interface FileUploadErrorDialogProps {
    open?: boolean;
    onClose: () => void;
    validationErrors?: FileUploadValidationError[];
}

export const FileUploadErrorDialog = ({ open = false, onClose, validationErrors }: FileUploadErrorDialogProps): React.ReactElement | null => {
    if (validationErrors === undefined) {
        return null;
    }

    const errorsPerFile = validationErrors.reduce<{ [key: string]: FileUploadValidationError[] }>((acc, error) => {
        const fileId = error.file.path ?? error.file.name;
        const existingErrorsOfSameFile = acc[fileId] ?? [];

        return {
            ...acc,
            [fileId]: [...existingErrorsOfSameFile, error],
        };
    }, {});

    return (
        <Dialog maxWidth="lg" fullWidth open={open}>
            <DialogTitle>
                <FormattedMessage id="comet.pages.dam.uploadErrors" defaultMessage="Upload errors" />
            </DialogTitle>
            <DialogContent>
                <Typography style={{ paddingBottom: "16px" }} variant="h6">
                    <FormattedMessage id="comet.pages.dam.followingFilesCouldNotBeUploaded" defaultMessage="Following files could not be uploaded:" />
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell>
                                <FormattedMessage id="comet.pages.dam.file" defaultMessage="File" />
                            </TableHeadCell>
                            <TableHeadCell>
                                <FormattedMessage id="comet.pages.dam.errors" defaultMessage="Errors" />
                            </TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.values(errorsPerFile).map((errorsOfFile) => {
                            return (
                                <TableRow key={errorsOfFile[0].file.path ?? errorsOfFile[0].file.name}>
                                    <TableCell>
                                        <Typography variant="h6">{errorsOfFile[0].file.name}</Typography>
                                        <Path variant="body2">{errorsOfFile[0].file.path}</Path>
                                    </TableCell>
                                    <TableCell>
                                        <List>
                                            {errorsOfFile.map((error, index) => {
                                                return (
                                                    <ListItem key={index}>
                                                        <Typography variant="body1">{error.message}</Typography>
                                                    </ListItem>
                                                );
                                            })}
                                        </List>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={onClose}>
                    <FormattedMessage {...messages.ok} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
