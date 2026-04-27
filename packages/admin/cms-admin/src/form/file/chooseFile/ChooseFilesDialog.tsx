import { Button, Dialog, StackLink, SubRoute } from "@comet/admin";
import { DialogActions } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { MemoryRouter } from "react-router";

import { useDamConfig } from "../../../dam/config/damConfig";
import { DamScopeProvider } from "../../../dam/config/DamScopeProvider";
import { useDamScope } from "../../../dam/config/useDamScope";
import { DamTable } from "../../../dam/DamTable";
import type { DamItemSelectionMap, GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../../dam/DataGrid/FolderDataGrid";
import DamItemLabel from "../../../dam/DataGrid/label/DamItemLabel";
import type { RenderDamLabelOptions } from "../../../dam/DataGrid/label/DamItemLabelColumn";
import { isFile } from "../../../dam/helpers/isFile";
import { RedirectToPersistedDamLocation } from "./RedirectToPersistedDamLocation";

const StyledStackLink = styled(StackLink)`
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: ${({ theme }) => theme.palette.grey[900]};
`;

const renderDamLabel = (
    row: GQLDamFileTableFragment | GQLDamFolderTableFragment,
    { matches, filterApi, showLicenseWarnings = false }: RenderDamLabelOptions,
) => {
    return isFile(row) ? (
        // Files are non-interactive in multi-select mode: clicking the row selects it via the
        // checkbox, not via navigation to the file's detail page.
        <DamItemLabel asset={row} matches={matches} showLicenseWarnings={showLicenseWarnings} />
    ) : (
        <StyledStackLink
            pageName="folder"
            payload={row.id}
            onClick={() => {
                filterApi.formApi.change("searchText", undefined);
            }}
        >
            <DamItemLabel asset={row} matches={matches} />
        </StyledStackLink>
    );
};

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

    // Seed the selection only on the false→true open transition. The parent passes a freshly-
    // constructed `initialFileIds` array every render; depending on it here would re-seed on
    // every parent re-render and clobber the user's in-progress checkbox changes.
    const wasOpenRef = useRef(false);
    useEffect(() => {
        if (open && !wasOpenRef.current) {
            setSelectionMap(new Map(initialFileIds.map((id) => [id, "file"] as const)));
        }
        wasOpenRef.current = open;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

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
                            renderDamLabel={(row, options) =>
                                renderDamLabel(row, { ...options, showLicenseWarnings: damConfig.enableLicenseFeature })
                            }
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
