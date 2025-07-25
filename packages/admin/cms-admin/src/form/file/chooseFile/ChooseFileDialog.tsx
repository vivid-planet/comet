import { Button, StackLink, SubRoute } from "@comet/admin";
import { Close } from "@comet/admin-icons";
import {
    // eslint-disable-next-line no-restricted-imports
    Dialog,
    DialogTitle,
    IconButton,
} from "@mui/material";
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

const FixedHeightDialog = styled(Dialog)`
    & .MuiDialog-paper {
        height: 100%; // The fixed height prevents the height of the dialog from changing when navigating between folders which may have different heights depending on the number of items in the folder
    }
`;

const StyledDialogTitle = styled(DialogTitle)`
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CloseButton = styled(IconButton)`
    position: absolute;
    right: ${({ theme }) => theme.spacing(2)};
`;

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
        <FixedHeightDialog open={open} onClose={onClose} fullWidth maxWidth="xl">
            <StyledDialogTitle>
                <FormattedMessage id="comet.form.file.selectFile" defaultMessage="Select file from DAM" />
                <CloseButton onClick={(event) => onClose(event, "backdropClick")} color="inherit">
                    <Close />
                </CloseButton>
            </StyledDialogTitle>
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
        </FixedHeightDialog>
    );
};
