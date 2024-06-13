import { BaseTranslationDialog } from "@comet/admin";
import { EditorState } from "draft-js";
import * as React from "react";

import { Rte } from "../Rte";
import RteReadOnly from "../RteReadOnly";

interface EditorStateTranslationDialogProps {
    open: boolean;
    onClose: () => void;
    originalText: EditorState;
    translatedText: EditorState;
    onApplyTranslation: (newValue: EditorState) => void;
}

export const EditorStateTranslationDialog: React.FC<EditorStateTranslationDialogProps> = (props) => {
    const { open, onClose, originalText, translatedText, onApplyTranslation } = props;

    return (
        <BaseTranslationDialog
            open={open}
            onClose={onClose}
            originalText={originalText}
            translatedText={translatedText}
            onApplyTranslation={onApplyTranslation}
            renderOriginalText={(text) => <RteReadOnly value={text} />}
            renderTranslatedText={(text, onChange) => <Rte value={text} onChange={onChange} options={{ disableContentTranslation: true }} />}
        />
    );
};
