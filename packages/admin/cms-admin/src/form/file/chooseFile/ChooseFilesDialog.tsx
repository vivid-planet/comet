import { Button, Dialog, SubRoute } from "@comet/admin";
import { DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { MemoryRouter } from "react-router";

import { useDamConfig } from "../../../dam/config/damConfig";
import { DamScopeProvider } from "../../../dam/config/DamScopeProvider";
import { useDamScope } from "../../../dam/config/useDamScope";
import { DamTable } from "../../../dam/DamTable";
import type { DamItemSelectionMap } from "../../../dam/DataGrid/FolderDataGrid";
import { RedirectToPersistedDamLocation } from "./RedirectToPersistedDamLocation";

interface ChooseFilesDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (fileIds: string[]) => void;
    initialFileIds: string[];
    allowedMimetypes?: string[];
}

export const ChooseFilesDialog = ({ open, onClose, onConfirm, initialFileIds, allowedMimetypes }: ChooseFilesDialogProps) => {
    const damConfig = useDamConfig();
    const scope = useDamScope();

    let stateKey = "choose-files-dam-location";
    if (Object.keys(scope).length > 0) {
        stateKey = `${Object.values(scope).join("-")}-${stateKey}`;
    }

    const [selectionMap, setSelectionMap] = useState<DamItemSelectionMap>(new Map());

    useEffect(() => {
        if (open) {
            setSelectionMap(new Map(initialFileIds.map((id) => [id, "file"] as const)));
        }
    }, [open, initialFileIds]);

    const handleConfirm = () => {
        const fileIds = Array.from(selectionMap.entries())
            .filter(([, type]) => type === "file")
            .map(([id]) => id);
        onConfirm(fileIds);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            title={<FormattedMessage id="comet.form.file.selectFiles" defaultMessage="Select files from DAM" />}
            slotProps={{
                root: {
                    PaperProps: {
                        sx: { height: "100%" },
                    },
                },
            }}
        >
            <DamScopeProvider>
                <MemoryRouter>
                    <SubRoute path="">
                        <RedirectToPersistedDamLocation stateKey={stateKey} />
                        <DamTable
                            allowedMimetypes={allowedMimetypes}
                            hideContextMenu={true}
                            hideMultiselect={false}
                            hideArchiveFilter={true}
                            disableFolderSelection={true}
                            selectionMap={selectionMap}
                            onSelectionChange={setSelectionMap}
                            additionalToolbarItems={damConfig.additionalToolbarItems}
                        />
                    </SubRoute>
                </MemoryRouter>
            </DamScopeProvider>
            <DialogActions>
                <Button variant="textLight" onClick={onClose}>
                    <FormattedMessage id="comet.generic.cancel" defaultMessage="Cancel" />
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    <FormattedMessage id="comet.form.file.applyFileSelection" defaultMessage="Apply" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
