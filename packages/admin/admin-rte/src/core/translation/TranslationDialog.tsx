import { messages } from "@comet/admin";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { EditorState } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import Rte from "../Rte";
import RteReadOnly from "../RteReadOnly";

interface TranslationDialogProps {
    open: boolean;
    close: () => void;
    originalText: EditorState;
    translatedText: EditorState;
    editTranslation: (newValue: EditorState) => void;
    applyTranslation: (newValue: EditorState) => void;
}

export const TranslationDialog: React.FC<TranslationDialogProps> = (props) => {
    const { open, close, originalText, translatedText, editTranslation, applyTranslation } = props;

    return (
        <Dialog open={open} onClose={close}>
            <DialogTitle>
                <FormattedMessage id="comet.translator.translation" defaultMessage="Translation" />
            </DialogTitle>
            <DialogContent>
                <TwoColumnLayout
                    leftContent={<RteReadOnly value={originalText} />}
                    rightContent={<Rte value={translatedText} onChange={editTranslation} />}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        applyTranslation(translatedText);
                        close();
                    }}
                    color="primary"
                    variant="contained"
                >
                    <FormattedMessage {...messages.apply} />
                </Button>
                <Button onClick={close} color="primary">
                    <FormattedMessage {...messages.cancel} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const TwoColumnLayout = ({ leftContent, rightContent }: { leftContent: JSX.Element; rightContent: JSX.Element }) => {
    return (
        <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>{leftContent}</div>
            <div style={{ flex: 1 }}>{rightContent}</div>
        </div>
    );
};
