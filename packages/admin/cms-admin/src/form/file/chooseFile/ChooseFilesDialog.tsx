import { Button } from "@comet/admin";
import { DialogActions } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

import type { DamItemSelectionMap, GQLDamFileTableFragment } from "../../../dam/DataGrid/FolderDataGrid";
import DamItemLabel from "../../../dam/DataGrid/label/DamItemLabel";
import type { RenderDamLabelOptions } from "../../../dam/DataGrid/label/DamItemLabelColumn";
import { BaseChooseFromDamDialog } from "./BaseChooseFromDamDialog";

interface ChooseFilesDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (fileIds: string[]) => void | Promise<void>;
    initialFileIds: string[];
    allowedMimetypes?: string[];
}

export const ChooseFilesDialog = ({ open, onClose, onConfirm, initialFileIds, allowedMimetypes }: ChooseFilesDialogProps) => {
    const [selectionMap, setSelectionMap] = useState<DamItemSelectionMap>(new Map());
    const [isConfirming, setIsConfirming] = useState(false);

    // Seed the selection only on the false→true open transition. The parent passes a freshly-
    // constructed `initialFileIds` array every render; depending on it here would re-seed on
    // every parent re-render and clobber the user's in-progress checkbox changes.
    const wasOpenRef = useRef(false);
    useEffect(() => {
        if (open && !wasOpenRef.current) {
            setSelectionMap(new Map(initialFileIds.map((id) => [id, "file"] as const)));
            setIsConfirming(false);
        }
        wasOpenRef.current = open;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const selectedFileIds = Array.from(selectionMap.entries())
        .filter(([, type]) => type === "file")
        .map(([id]) => id);

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

    // Files are non-interactive in multi-select mode: clicking the row selects it via the
    // checkbox, not via navigation to the file's detail page.
    const renderFileLabel = (file: GQLDamFileTableFragment, { matches, showLicenseWarnings }: RenderDamLabelOptions) => (
        <DamItemLabel asset={file} matches={matches} showLicenseWarnings={showLicenseWarnings} />
    );

    return (
        <BaseChooseFromDamDialog
            open={open}
            onClose={handleClose}
            title={<FormattedMessage id="comet.form.file.selectFiles" defaultMessage="Select files from DAM" />}
            stateKey="choose-files-dam-location"
            allowedMimetypes={allowedMimetypes}
            renderFileLabel={renderFileLabel}
            hideMultiselect={false}
            disableFolderSelection={true}
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
