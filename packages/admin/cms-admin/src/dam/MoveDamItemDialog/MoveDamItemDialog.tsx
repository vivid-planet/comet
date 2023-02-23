import { useQuery } from "@apollo/client";
import { Move, Reset } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { TextMatch } from "../../common/MarkedMatches";
import { SearchInput } from "../../common/SearchInput";
import { GQLAllFoldersWithoutFiltersQuery, GQLAllFoldersWithoutFiltersQueryVariables } from "../../graphql.generated";
import { ChooseFolder } from "./ChooseFolder";
import { allFoldersQuery } from "./ChooseFolder.gql";
import { useFolderTree } from "./useFolderTree";
import { useFolderTreeSearch } from "./useFolderTreeSearch";

const FixedHeightDialog = styled(Dialog)`
    & .MuiDialog-paper {
        height: 80vh;
    }
`;

export type FolderSearchMatch = TextMatch & { folder: { id: string } };

interface MoveDamItemDialogProps {
    onClose: (event: React.SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => void;
    onChooseFolder: (folderId: string | null) => void;
    numberOfItems: number;
}

export const MoveDamItemDialog = ({ onClose, onChooseFolder, numberOfItems }: MoveDamItemDialogProps) => {
    const { data, loading } = useQuery<GQLAllFoldersWithoutFiltersQuery, GQLAllFoldersWithoutFiltersQueryVariables>(allFoldersQuery, {
        fetchPolicy: "network-only",
    });

    const {
        tree: folderTree,
        foldersToRender,
        setExpandedIds,
        toggleExpand,
        selectedId,
        setSelectedId,
    } = useFolderTree({ damFoldersFlat: data?.damFoldersFlat });

    const {
        foldersToRenderWithMatches,
        query,
        setQuery,
        currentMatchIndex,
        focusedFolderId,
        totalMatches,
        updateCurrentMatchIndex,
        jumpToNextMatch,
        jumpToPreviousMatch,
    } = useFolderTreeSearch({
        folderTree,
        foldersToRender,
        setExpandedIds,
    });

    return (
        <FixedHeightDialog open={true} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                <FormattedMessage id="comet.dam.moveDamItemDialog.selectTargetFolder" defaultMessage="Select target folder" />
            </DialogTitle>
            <DialogContent sx={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        width: "100%",
                        marginBottom: "20px",
                    }}
                >
                    <SearchInput
                        autoFocus={true}
                        query={query}
                        onQueryChange={(newQuery) => {
                            setQuery((prevQuery) => {
                                if (prevQuery === "") {
                                    updateCurrentMatchIndex(0);
                                } else if (newQuery === "") {
                                    updateCurrentMatchIndex(undefined);
                                }

                                return newQuery;
                            });
                        }}
                        totalMatches={totalMatches ?? 0}
                        currentMatch={currentMatchIndex}
                        jumpToNextMatch={jumpToNextMatch}
                        jumpToPreviousMatch={jumpToPreviousMatch}
                    />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <ChooseFolder
                        folderTree={folderTree}
                        foldersToRenderWithMatches={foldersToRenderWithMatches}
                        loading={loading}
                        toggleExpand={toggleExpand}
                        selectedId={selectedId}
                        onFolderClick={(id: string | null) => {
                            setSelectedId(id);
                        }}
                        focusedFolderId={focusedFolderId}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    startIcon={<Reset />}
                    onClick={() => {
                        setSelectedId(undefined);
                    }}
                    disabled={selectedId === undefined}
                >
                    <FormattedMessage id="comet.dam.moveDamItemDialog.startOver" defaultMessage="Start over" />
                </Button>
                <Button
                    startIcon={<Move />}
                    variant="contained"
                    onClick={() => {
                        if (selectedId !== undefined) {
                            onChooseFolder(selectedId);
                        }
                    }}
                    disabled={selectedId === undefined}
                >
                    <FormattedMessage
                        id="comet.dam.moveDamItemDialog.moveItems"
                        defaultMessage="Move {num, plural, one {item} other {items}}"
                        values={{
                            num: numberOfItems,
                        }}
                    />
                </Button>
            </DialogActions>
        </FixedHeightDialog>
    );
};
