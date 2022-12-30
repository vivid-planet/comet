import { StackLink } from "@comet/admin";
import { Close } from "@comet/admin-icons";
import { Button, Dialog, DialogTitle, IconButton, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import { MemoryRouter } from "react-router";

import { TextMatch } from "../../../common/MarkedMatches";
import { DamTable } from "../../../dam/DamTable";
import DamItemLabel from "../../../dam/DataGrid/label/DamItemLabel";
import { isFile } from "../../../dam/helpers/isFile";
import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../../graphql.generated";

const FixedHeightDialog = styled(Dialog)`
    & .MuiDialog-paper {
        height: 80vh;
    }
`;

const StyledDialogTitle = styled(DialogTitle)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
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

const renderDamLabel = (
    row: GQLDamFileTableFragment | GQLDamFolderTableFragment,
    onChooseFile: (fileId: string) => void,
    { matches, isSearching }: { matches?: TextMatch[]; isSearching: boolean },
) => {
    return isFile(row) ? (
        <TableRowButton disableRipple={true} variant="text" onClick={() => onChooseFile(row.id)} fullWidth>
            <DamItemLabel asset={row} matches={matches} showPath={isSearching} />
        </TableRowButton>
    ) : (
        <Link
            underline="none"
            component={StackLink}
            pageName="folder"
            payload={row.id}
            sx={{
                width: "100%",
                height: "100%",
            }}
        >
            <DamItemLabel asset={row} matches={matches} showPath={isSearching} />
        </Link>
    );
};

interface ChooseFileDialogProps {
    open: boolean;
    onClose: (event: React.SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => void;
    onChooseFile: (fileId: string) => void;
    allowedMimetypes?: string[];
}

export const ChooseFileDialog = ({ open, onClose, onChooseFile, allowedMimetypes }: ChooseFileDialogProps): React.ReactElement => {
    return (
        <FixedHeightDialog open={open} onClose={onClose} fullWidth maxWidth="xl">
            <StyledDialogTitle>
                <FormattedMessage id="comet.form.file.selectFile" defaultMessage="Select file from DAM" />
                <CloseButton onClick={(event) => onClose(event, "backdropClick")} color="inherit">
                    <Close />
                </CloseButton>
            </StyledDialogTitle>
            <MemoryRouter>
                <DamTable
                    renderDamLabel={(row, { matches, isSearching }) => renderDamLabel(row, onChooseFile, { matches, isSearching })}
                    allowedMimetypes={allowedMimetypes}
                    damLocationStorageKey="choose-file-dam-location"
                    hideContextMenu={true}
                    disableScopeIndicator={true}
                    hideMultiselect={true}
                    hideArchiveFilter={true}
                />
            </MemoryRouter>
        </FixedHeightDialog>
    );
};
