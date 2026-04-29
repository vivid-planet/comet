import { Button } from "@comet/admin";
import { styled } from "@mui/material/styles";
import type { SyntheticEvent } from "react";
import { FormattedMessage } from "react-intl";

import type { GQLDamFileTableFragment } from "../../../dam/DataGrid/FolderDataGrid";
import DamItemLabel from "../../../dam/DataGrid/label/DamItemLabel";
import type { RenderDamLabelOptions } from "../../../dam/DataGrid/label/DamItemLabelColumn";
import { BaseChooseDamFileDialog } from "./BaseChooseDamFileDialog";

const TableRowButton = styled(Button)`
    padding: 0;
    justify-content: left;
    color: ${({ theme }) => theme.palette.grey[600]};

    &:hover {
        background-color: transparent;
    }
`;

interface ChooseDamFileDialogProps {
    open: boolean;
    onClose: (event: SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => void;
    onChooseFile: (fileId: string) => void;
    allowedMimetypes?: string[];
}

export const ChooseDamFileDialog = ({ open, onClose, onChooseFile, allowedMimetypes }: ChooseDamFileDialogProps) => {
    const renderFileLabel = (file: GQLDamFileTableFragment, { matches, showLicenseWarnings }: RenderDamLabelOptions) => (
        <TableRowButton disableRipple={true} variant="textDark" onClick={() => onChooseFile(file.id)} fullWidth>
            <DamItemLabel asset={file} matches={matches} showLicenseWarnings={showLicenseWarnings} />
        </TableRowButton>
    );

    return (
        <BaseChooseDamFileDialog
            open={open}
            onClose={onClose}
            title={<FormattedMessage id="comet.form.file.selectFile" defaultMessage="Select file from DAM" />}
            stateKey="choose-file-dam-location"
            allowedMimetypes={allowedMimetypes}
            renderFileLabel={renderFileLabel}
            hideMultiselect={true}
        />
    );
};
