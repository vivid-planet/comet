import { Button } from "@comet/admin";
import { styled } from "@mui/material/styles";
import { type SyntheticEvent } from "react";
import { FormattedMessage } from "react-intl";

<<<<<<< HEAD
import { useDamConfig } from "../../../dam/config/damConfig";
import { DamScopeProvider } from "../../../dam/config/DamScopeProvider";
import { useDamScope } from "../../../dam/config/useDamScope";
import { DamTable } from "../../../dam/DamTable";
import { type GQLDamFileTableFragment, type GQLDamFolderTableFragment } from "../../../dam/DataGrid/FolderDataGrid";
import DamItemLabel from "../../../dam/DataGrid/label/DamItemLabel";
import { type RenderDamLabelOptions } from "../../../dam/DataGrid/label/DamItemLabelColumn";
import { isFile } from "../../../dam/helpers/isFile";
import { RedirectToPersistedDamLocation } from "./RedirectToPersistedDamLocation";
=======
import type { GQLDamFileTableFragment } from "../../../dam/DataGrid/FolderDataGrid";
import DamItemLabel from "../../../dam/DataGrid/label/DamItemLabel";
import type { RenderDamLabelOptions } from "../../../dam/DataGrid/label/DamItemLabelColumn";
import { BaseChooseDamFileDialog } from "./BaseChooseDamFileDialog";
>>>>>>> c6703db56 (Multi select `FileField` (#5542))

const TableRowButton = styled(Button)`
    padding: 0;
    justify-content: left;
    color: ${({ theme }) => theme.palette.grey[600]};

    &:hover {
        background-color: transparent;
    }
`;

interface ChooseFileDialogProps {
    open: boolean;
    onClose: (event: SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => void;
    onChooseFile: (fileId: string) => void;
    allowedMimetypes?: string[];
}

type FileLabelProps = {
    file: GQLDamFileTableFragment;
    onChooseFile: (fileId: string) => void;
} & RenderDamLabelOptions;

const FileLabel = ({ file, onChooseFile, matches, showLicenseWarnings }: FileLabelProps) => (
    <TableRowButton disableRipple={true} variant="textDark" onClick={() => onChooseFile(file.id)} fullWidth>
        <DamItemLabel asset={file} matches={matches} showLicenseWarnings={showLicenseWarnings} />
    </TableRowButton>
);

export const ChooseDamFileDialog = ({ open, onClose, onChooseFile, allowedMimetypes }: ChooseFileDialogProps) => {
    return (
        <BaseChooseDamFileDialog
            open={open}
            onClose={onClose}
            title={<FormattedMessage id="comet.form.file.selectFile" defaultMessage="Select file from DAM" />}
            stateKey="choose-file-dam-location"
            allowedMimetypes={allowedMimetypes}
            renderFileLabel={(file, options) => <FileLabel file={file} onChooseFile={onChooseFile} {...options} />}
            hideMultiselect={true}
        />
    );
};
