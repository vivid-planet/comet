import { Move, Reset } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import { TextMatch } from "../../common/MarkedMatches";
import { SearchInput } from "../../common/SearchInput";
import { ChooseFolder } from "./ChooseFolder";

const FixedHeightDialog = styled(Dialog)`
    & .MuiDialog-paper {
        height: 80vh;
    }
`;

export type PageSearchMatch = TextMatch & { folder: { id: string } };

interface MoveDamItemDialogProps {
    onClose: (event: React.SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => void;
    onChooseFolder: (folderId: string | null) => void;
}

export const MoveDamItemDialog = ({ onClose, onChooseFolder }: MoveDamItemDialogProps) => {
    const [selectedId, setSelectedId] = React.useState<string | null>();
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [matches, setMatches] = React.useState<PageSearchMatch[] | null>(null);
    const [currentMatchIndex, setCurrentMatchIndex] = React.useState<number | undefined>(undefined);

    const updateCurrentMatchIndex = React.useCallback(
        (nextCurrentMatchIndex: number) => {
            if (matches === null) {
                return;
            }

            setMatches(matches.map((match, index) => ({ ...match, focused: index === nextCurrentMatchIndex })));
            setCurrentMatchIndex(nextCurrentMatchIndex);
        },
        [matches],
    );

    const jumpToNextMatch = React.useCallback(() => {
        if (matches === null || currentMatchIndex === undefined) {
            return;
        }

        updateCurrentMatchIndex(currentMatchIndex === matches.length - 1 ? 0 : currentMatchIndex + 1);
    }, [currentMatchIndex, matches, updateCurrentMatchIndex]);

    const jumpToPreviousMatch = React.useCallback(() => {
        if (matches === null || currentMatchIndex === undefined) {
            return;
        }

        updateCurrentMatchIndex(currentMatchIndex === 0 ? matches.length - 1 : currentMatchIndex - 1);
    }, [currentMatchIndex, matches, updateCurrentMatchIndex]);

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
                        query={searchQuery}
                        onQueryChange={(newQuery) => {
                            setSearchQuery((prevQuery) => {
                                if (prevQuery === "") {
                                    setCurrentMatchIndex(0);
                                } else if (newQuery === "") {
                                    setCurrentMatchIndex(undefined);
                                }

                                return newQuery;
                            });
                        }}
                        totalMatches={matches?.length ?? 0}
                        currentMatch={currentMatchIndex}
                        jumpToNextMatch={jumpToNextMatch}
                        jumpToPreviousMatch={jumpToPreviousMatch}
                    />
                </div>
                <div style={{ flexGrow: 1 }}>
                    <ChooseFolder
                        selectedId={selectedId}
                        onFolderClick={(id: string | null) => {
                            setSelectedId(id);
                        }}
                        searchQuery={searchQuery}
                        matches={matches}
                        onMatchesChange={(matches) => {
                            setMatches(matches);
                        }}
                        currentMatchIndex={currentMatchIndex}
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
                    <FormattedMessage id="comet.dam.moveDamItemDialog.startOver" defaultMessage="Start over" />{" "}
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
                    <FormattedMessage id="comet.dam.moveDamItemDialog.moveItems" defaultMessage="Move item(s)" />
                </Button>
            </DialogActions>
        </FixedHeightDialog>
    );
};
