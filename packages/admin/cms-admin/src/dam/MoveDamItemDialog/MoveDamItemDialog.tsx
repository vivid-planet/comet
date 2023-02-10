import { Move, Reset } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useDebouncedCallback } from "use-debounce";

import { ChooseFolder } from "./ChooseFolder";

const FixedHeightDialog = styled(Dialog)`
    & .MuiDialog-paper {
        height: 80vh;
    }
`;

interface MoveDamItemDialogProps {
    isOpen: boolean;
    onClose: (event: React.SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => void;
    onChooseFolder: (folderId: string | null) => void;
}

export const MoveDamItemDialog = ({ isOpen, onClose, onChooseFolder }: MoveDamItemDialogProps) => {
    const [selectedId, setSelectedId] = React.useState<string | null>();
    const [searchQuery, setSearchQuery] = React.useState<string>("");

    const debouncedOnChange = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    }, 500);

    return (
        <FixedHeightDialog open={isOpen} onClose={onClose} fullWidth maxWidth="xl">
            <DialogTitle>
                <FormattedMessage id="comet.dam.moveDamItemDialog.selectTargetFolder" defaultMessage="Select target folder" />
            </DialogTitle>
            <DialogContent>
                <div
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "40px",
                    }}
                >
                    <input onChange={debouncedOnChange} />
                </div>
                <ChooseFolder
                    selectedId={selectedId}
                    onFolderClick={(id: string | null) => {
                        setSelectedId(id);
                    }}
                    searchQuery={searchQuery}
                />
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
