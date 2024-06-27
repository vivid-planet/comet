import { TextField } from "@mui/material";
import * as React from "react";

import { BaseTranslationDialog } from "./BaseTranslationDialog";

interface PlainTextTranslationDialogProps {
    open: boolean;
    onClose: () => void;
    originalText: string;
    translatedText: string;
    onApplyTranslation: (value: string) => void;
}

export const PlainTextTranslationDialog: React.FC<PlainTextTranslationDialogProps> = (props) => {
    const { open, onClose, originalText, translatedText, onApplyTranslation } = props;

    return (
        <BaseTranslationDialog
            open={open}
            onClose={onClose}
            originalText={originalText}
            translatedText={translatedText}
            onApplyTranslation={onApplyTranslation}
            renderOriginalText={(text) => <TextField value={text} disabled fullWidth />}
            renderTranslatedText={(text, onChange) => <TextField value={text} onChange={(event) => onChange(event.target.value)} fullWidth />}
        />
    );
};
