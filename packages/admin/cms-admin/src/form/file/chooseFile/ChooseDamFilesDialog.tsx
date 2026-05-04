import { Button } from "@comet/admin";
import { DialogActions } from "@mui/material";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import type { DamItemSelectionMap, GQLDamFileTableFragment } from "../../../dam/DataGrid/FolderDataGrid";
import DamItemLabel from "../../../dam/DataGrid/label/DamItemLabel";
import type { RenderDamLabelOptions } from "../../../dam/DataGrid/label/DamItemLabelColumn";
import { BaseChooseDamFileDialog } from "./BaseChooseDamFileDialog";

interface ChooseDamFilesDialogProps {
    onClose: () => void;
    onConfirm: (fileIds: string[]) => void | Promise<void>;
    initialFileIds: string[];
    allowedMimetypes?: string[];
}

const FileLabel = ({ file, matches, showLicenseWarnings }: { file: GQLDamFileTableFragment } & RenderDamLabelOptions) => (
    <DamItemLabel asset={file} matches={matches} showLicenseWarnings={showLicenseWarnings} />
);

export const ChooseDamFilesDialog = ({ onClose, onConfirm, initialFileIds, allowedMimetypes }: ChooseDamFilesDialogProps) => {
    const [selectionMap, setSelectionMap] = useState<DamItemSelectionMap>(() => new Map(initialFileIds.map((id) => [id, "file"])));
    const [isConfirming, setIsConfirming] = useState(false);

    const selectedFileIds = Array.from(selectionMap.keys());

    const handleConfirm = async () => {
        setIsConfirming(true);
        try {
            await onConfirm(selectedFileIds);
        } finally {
            setIsConfirming(false);
        }
    };

    const handleClose = () => {
        if (isConfirming) {
            return;
        }
        onClose();
    };

    return (
        <BaseChooseDamFileDialog
            open
            onClose={handleClose}
            title={<FormattedMessage id="comet.form.file.selectFiles" defaultMessage="Select files from DAM" />}
            stateKey="choose-files-dam-location"
            allowedMimetypes={allowedMimetypes}
            renderFileLabel={(file, options) => <FileLabel file={file} {...options} />}
            hideMultiselect={false}
            disableFolderSelection={true}
            keepNonExistentRowsSelected={true}
            selectionMap={selectionMap}
            onSelectionChange={setSelectionMap}
            actions={
                <DialogActions>
                    <Button variant="textLight" onClick={handleClose} disabled={isConfirming}>
                        <FormattedMessage id="comet.generic.cancel" defaultMessage="Cancel" />
                    </Button>
                    <Button variant="primary" onClick={handleConfirm} disabled={selectedFileIds.length === 0 || isConfirming}>
                        <FormattedMessage
                            id="comet.form.file.applyFileSelection"
                            defaultMessage="Select {count, plural, one {# file} other {# files}}"
                            values={{ count: selectedFileIds.length }}
                        />
                    </Button>
                </DialogActions>
            }
        />
    );
};
