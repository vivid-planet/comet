import { messages } from "@comet/admin";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { EditorState } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import Rte from "../Rte";
import RteReadOnly from "../RteReadOnly";

interface TranslationDialogProps {
    open: boolean;
    onClose: () => void;
    originalText: EditorState;
    translatedText?: EditorState;
    onEditTranslation: (newValue: EditorState) => void;
    onApplyTranslation: (newValue: EditorState) => void;
}

export const TranslationDialog: React.FC<TranslationDialogProps> = (props) => {
    const { open, onClose, originalText, translatedText, onEditTranslation, onApplyTranslation } = props;

    if (!translatedText) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                <FormattedMessage id="comet.translator.translation" defaultMessage="Translation" />
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={4} columns={2} alignItems="center">
                    <Grid item xs={1}>
                        <RteReadOnly value={originalText} />
                    </Grid>
                    <Grid item xs={1}>
                        <Rte value={translatedText} onChange={onEditTranslation} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    <FormattedMessage {...messages.cancel} />
                </Button>
                <Button
                    onClick={() => {
                        onApplyTranslation(translatedText);
                        onClose();
                    }}
                    color="primary"
                    variant="contained"
                >
                    <FormattedMessage {...messages.apply} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};
