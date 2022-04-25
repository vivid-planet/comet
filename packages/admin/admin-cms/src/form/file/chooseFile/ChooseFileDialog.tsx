import { StackLink } from "@comet/admin";
import { Close } from "@comet/admin-icons";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import { MemoryRouter } from "react-router";

import { TextMatch } from "../../../common/MarkedMatches";
import { DamTable } from "../../../dam/DamTable";
import DamLabel from "../../../dam/Table/DamLabel";
import { isFile } from "../../../dam/Table/FolderTableRow";
import { GQLDamFileTableFragment, GQLDamFolderTableFragment, GQLFileCategory } from "../../../graphql.generated";

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
    color: inherit;
    padding: 0;
`;

const TableRowButton = styled(Button)`
    padding: 0;
    justify-content: left;

    &:hover {
        background-color: transparent;
    }
`;

const renderDamLabel = (
    row: GQLDamFileTableFragment | GQLDamFolderTableFragment,
    onChooseFile: (fileId: string) => void,
    { matches }: { matches?: TextMatch[] },
) => {
    return isFile(row) ? (
        <div>
            <TableRowButton disableRipple={true} variant={"text"} color={"info"} onClick={() => onChooseFile(row.id)} fullWidth>
                <DamLabel asset={row} matches={matches} />
            </TableRowButton>
        </div>
    ) : (
        <Link underline="none" component={StackLink} pageName={"folder"} payload={row.id}>
            <DamLabel asset={row} matches={matches} />
        </Link>
    );
};

interface ChooseFileDialogProps {
    open: boolean;
    onClose: (event: React.SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => void;
    onChooseFile: (fileId: string) => void;
    /** Filter files by category. Is overruled by allowedMimetypes. */
    fileCategory?: GQLFileCategory;
    /** Filter files by mimetype. Overrules fileCategory. */
    allowedMimetypes?: string[];
}

export const ChooseFileDialog = ({ open, onClose, onChooseFile, fileCategory, allowedMimetypes }: ChooseFileDialogProps): React.ReactElement => {
    return (
        <FixedHeightDialog open={open} onClose={onClose} fullWidth maxWidth="xl">
            <StyledDialogTitle>
                <FormattedMessage id="comet.form.file.selectFile" defaultMessage="Select file from DAM" />
                <CloseButton onClick={(event) => onClose(event, "backdropClick")}>
                    <Close fontSize="medium" />
                </CloseButton>
            </StyledDialogTitle>
            <MemoryRouter>
                <DamTable
                    renderDamLabel={(row, { matches }) => renderDamLabel(row, onChooseFile, { matches })}
                    TableContainer={DialogContent}
                    hideContextMenu={true}
                    fileCategory={fileCategory}
                    allowedMimetypes={allowedMimetypes}
                    disableScopeIndicator={true}
                />
            </MemoryRouter>
        </FixedHeightDialog>
    );
};
