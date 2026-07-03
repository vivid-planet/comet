import { Alert, Button, messages } from "@comet/admin";
import {
    // eslint-disable-next-line no-restricted-imports
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

import { DamVideoFileSizeWarningMessage } from "../../helpers/DamVideoFileSizeWarning";

const Path = styled(Typography)`
    color: ${({ theme }) => theme.palette.grey[300]};
`;

export interface FileUploadWarning {
    file: { name: string; path?: string };
}

interface FileUploadWarningDialogProps {
    open?: boolean;
    onClose: () => void;
    warnings?: FileUploadWarning[];
}

export const FileUploadWarningDialog = ({ open = false, onClose, warnings }: FileUploadWarningDialogProps) => {
    if (warnings === undefined || warnings.length === 0) {
        return null;
    }

    return (
        <Dialog maxWidth="sm" fullWidth open={open}>
            <DialogTitle>
                <FormattedMessage id="comet.dam.upload.warnings" defaultMessage="Upload warnings" />
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" title={<FormattedMessage id="comet.dam.videoFileSizeWarning.title" defaultMessage="Large video" />}>
                    <DamVideoFileSizeWarningMessage />
                </Alert>
                <List>
                    {warnings.map((warning) => (
                        <ListItem key={warning.file.path ?? warning.file.name} disableGutters>
                            <div>
                                <Typography variant="subtitle1">{warning.file.name}</Typography>
                                {warning.file.path && <Path variant="body2">{warning.file.path}</Path>}
                            </div>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    <FormattedMessage {...messages.ok} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
