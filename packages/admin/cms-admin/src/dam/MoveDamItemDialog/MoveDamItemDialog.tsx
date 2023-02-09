import { Move, Reset } from "@comet/admin-icons";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import { FormattedMessage } from "react-intl";

import { ChooseFolder } from "./ChooseFolder";

interface MoveDamItemDialogProps {
    isOpen: boolean;
    onClose: (event: React.SyntheticEvent, reason: "backdropClick" | "escapeKeyDown") => void;
    onChooseFolder: (folderId: string | null) => void;
}

export const MoveDamItemDialog = ({ isOpen, onClose, onChooseFolder }: MoveDamItemDialogProps) => {
    const [selectedId, setSelectedId] = React.useState<string | null>();

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>
                <FormattedMessage id="comet.dam.moveDamItemDialog.selectTargetFolder" defaultMessage="Select target folder" />
            </DialogTitle>
            <DialogContent>
                <ChooseFolder
                    selectedId={selectedId}
                    onFolderClick={(id: string | null) => {
                        setSelectedId(id);
                    }}
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
        </Dialog>
    );
};
