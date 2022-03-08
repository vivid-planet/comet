import { StackLink } from "@comet/admin";
import { Close } from "@comet/admin-icons";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Link } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import { MemoryRouter } from "react-router";
import styled from "styled-components";

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
    & > .MuiTypography-root {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
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

const renderDamLabel = (row: GQLDamFileTableFragment | GQLDamFolderTableFragment, onChooseFile: (fileId: string) => void) => {
    return isFile(row) ? (
        <div>
            <TableRowButton disableRipple={true} variant={"text"} color={"default"} onClick={() => onChooseFile(row.id)} fullWidth>
                <DamLabel asset={row} />
            </TableRowButton>
        </div>
    ) : (
        <Link underline="none" component={StackLink} pageName={"folder"} payload={row.id}>
            <DamLabel asset={row} />
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
                    renderDamLabel={(row) => renderDamLabel(row, onChooseFile)}
                    TableContainer={DialogContent}
                    hideContextMenu={true}
                    fileCategory={fileCategory}
                    allowedMimetypes={allowedMimetypes}
                />
            </MemoryRouter>
        </FixedHeightDialog>
    );
};
