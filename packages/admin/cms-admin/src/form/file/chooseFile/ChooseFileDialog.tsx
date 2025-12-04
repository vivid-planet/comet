import { Button, Dialog, StackLink, SubRoute } from "@comet/admin";
import { styled } from "@mui/material/styles";
import { type SyntheticEvent } from "react";
import { FormattedMessage } from "react-intl";
import { MemoryRouter } from "react-router";

import { useDamConfig } from "../../../dam/config/damConfig";
import { DamScopeProvider } from "../../../dam/config/DamScopeProvider";
import { useDamScope } from "../../../dam/config/useDamScope";
import { DamTable } from "../../../dam/DamTable";
import { type GQLDamFileTableFragment, type GQLDamFolderTableFragment } from "../../../dam/DataGrid/FolderDataGrid";
import DamItemLabel from "../../../dam/DataGrid/label/DamItemLabel";
import { type RenderDamLabelOptions } from "../../../dam/DataGrid/label/DamItemLabelColumn";
import { isFile } from "../../../dam/helpers/isFile";
import { RedirectToPersistedDamLocation } from "./RedirectToPersistedDamLocation";

const TableRowButton = styled(Button)`
    padding: 0;
    justify-content: left;
    color: ${({ theme }) => theme.palette.grey[600]};

    &:hover {
        background-color: transparent;
    }
`;

const StyledStackLink = styled(StackLink)`
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: ${({ theme }) => theme.palette.grey[900]};
`;

const renderDamLabel = (
    row: GQLDamFileTableFragment | GQLDamFolderTableFragment,
    onChooseFile: (fileId: string) => void,
    { matches, filterApi, showLicenseWarnings = false }: RenderDamLabelOptions,
) => {
    return isFile(row) ? (
        <TableRowButton disableRipple={true} variant="textDark" onClick={() => onChooseFile(row.id)} fullWidth>
            <DamItemLabel asset={row} matches={matches} showLicenseWarnings={showLicenseWarnings} />
        </TableRowButton>
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

interface ChooseFileDialogProps {
    open: boolean;
    onClose: (event: SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => void;
    onChooseFile: (fileId: string) => void;
    allowedMimetypes?: string[];
}

export const ChooseFileDialog = ({ open, onClose, onChooseFile, allowedMimetypes }: ChooseFileDialogProps) => {
    const damConfig = useDamConfig();
    let stateKey = "choose-file-dam-location";
    const scope = useDamScope();

    if (Object.keys(scope).length > 0) {
        stateKey = `${Object.values(scope).join("-")}-${stateKey}`;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            title={<FormattedMessage id="comet.form.file.selectFile" defaultMessage="Select file from DAM" />}
            slotProps={{
                root: {
                    PaperProps: {
                        sx: { height: "100%" }, // The fixed height prevents the height of the dialog from changing when navigating between folders which may have different heights depending on the number of items in the folder
                    },
                },
            }}
        >
            <DamScopeProvider>
                <MemoryRouter>
                    <SubRoute path="">
                        <RedirectToPersistedDamLocation stateKey={stateKey} />
                        <DamTable
                            renderDamLabel={(row, { matches, filterApi }: RenderDamLabelOptions) =>
                                renderDamLabel(row, onChooseFile, { matches, filterApi, showLicenseWarnings: damConfig.enableLicenseFeature })
                            }
                            allowedMimetypes={allowedMimetypes}
                            hideContextMenu={true}
                            hideMultiselect={true}
                            hideArchiveFilter={true}
                            additionalToolbarItems={damConfig.additionalToolbarItems}
                        />
                    </SubRoute>
                </MemoryRouter>
            </DamScopeProvider>
        </Dialog>
    );
};
