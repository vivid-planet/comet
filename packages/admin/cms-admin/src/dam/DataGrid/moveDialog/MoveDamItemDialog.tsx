import { StackLink } from "@comet/admin";
import { Close, Move, ThreeDotSaving } from "@comet/admin-icons";
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Link } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import { MemoryRouter } from "react-router";

import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../../graphql.generated";
import { DamTable } from "../../DamTable";
import { isFile } from "../../helpers/isFile";
import DamItemLabel from "../label/DamItemLabel";
import { RenderDamLabelOptions } from "../label/DamItemLabelColumn";

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

const StyledDialogContent = styled(DialogContent)`
    padding: 0;

    &.MuiDialogContent-root {
        padding-top: 0;
    }

    & .CometAdminToolbar-root {
        top: 0;
    }
`;

const CloseButton = styled(IconButton)`
    position: absolute;
    right: ${({ theme }) => theme.spacing(2)};
`;

const ButtonWrapper = styled("div")`
    margin-left: 20px;
    display: flex;
    justify-content: space-between;
    gap: 5px;
`;

const FileWrapper = styled("div")`
    color: rgba(0, 0, 0, 0.5);
`;

const renderDamLabel = (
    row: GQLDamFileTableFragment | GQLDamFolderTableFragment,
    onChooseFolder: (folderId: string) => void,
    { matches, numSelectedItems, isSearching, filterApi }: RenderDamLabelOptions & { numSelectedItems: number },
) => {
    return isFile(row) ? (
        <FileWrapper>
            <DamItemLabel asset={row} matches={matches} showPath={isSearching} />
        </FileWrapper>
    ) : (
        <>
            <Link
                underline="none"
                component={StackLink}
                pageName="folder"
                payload={row.id}
                sx={{
                    width: "100%",
                    height: "100%",
                }}
                onClick={() => {
                    filterApi.formApi.change("searchText", undefined);
                }}
            >
                <DamItemLabel asset={row} matches={matches} showPath={isSearching} />
            </Link>
            <ButtonWrapper>
                <Button
                    variant="contained"
                    startIcon={<Move />}
                    onClick={() => {
                        onChooseFolder(row.id);
                    }}
                >
                    <FormattedMessage
                        id="comet.dam.customFolderLabel.moveItemsToThisFolder"
                        defaultMessage="Move {num, plural, one {item} other {items}} to this folder"
                        values={{
                            num: numSelectedItems,
                        }}
                    />
                </Button>
            </ButtonWrapper>
        </>
    );
};

const generateTableHeadActionButton = ({ onChooseFolder }: { onChooseFolder: (folderId: string | null) => void }) => {
    return ({ folderId, folderName }: { folderId?: string; folderName?: React.ReactNode }) => {
        return (
            <Button
                variant="contained"
                startIcon={<Move />}
                onClick={() => {
                    onChooseFolder(folderId ?? null);
                }}
            >
                <FormattedMessage
                    id="comet.dam.customFolderLabel.moveItemsToThisFolder"
                    defaultMessage="Move {num, plural, one {item} other {items}} to {folderName}"
                    values={{
                        // TODO: correct number
                        num: 1,
                        folderName: folderName ?? (
                            <>
                                &nbsp;
                                <ThreeDotSaving />
                            </>
                        ),
                    }}
                />
            </Button>
        );
    };
};

interface MoveDamItemDialogProps {
    open: boolean;
    onClose: (event: React.SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => void;
    onChooseFolder: (folderId: string | null) => void;
    numSelectedItems: number;
}

export const MoveDamItemDialog = ({ open, onClose, onChooseFolder, numSelectedItems }: MoveDamItemDialogProps) => {
    return (
        <FixedHeightDialog open={open} onClose={onClose} fullWidth maxWidth="xl">
            <StyledDialogTitle>
                <FormattedMessage id="comet.form.file.selectFile" defaultMessage="Select file from DAM" />
                <CloseButton onClick={(event) => onClose(event, "backdropClick")} color="inherit">
                    <Close />
                </CloseButton>
            </StyledDialogTitle>
            <StyledDialogContent>
                <MemoryRouter>
                    <DamTable
                        renderDamLabel={(row, options) => renderDamLabel(row, onChooseFolder, { ...options, numSelectedItems })}
                        TableHeadActionButton={generateTableHeadActionButton({ onChooseFolder })}
                        damLocationStorageKey="move-items-dam-location"
                        hideContextMenu={true}
                        disableScopeIndicator={true}
                        hideMultiselect={true}
                        hideArchiveFilter={true}
                    />
                </MemoryRouter>
            </StyledDialogContent>
        </FixedHeightDialog>
    );
};
