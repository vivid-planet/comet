import { messages } from "@comet/admin";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
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
        <Dialog open={open} onClose={close} fullWidth maxWidth="lg">
            <DialogTitle>
                <FormattedMessage id="comet.translator.translation" defaultMessage="Translation" />
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={4} columns={2} alignItems="center">
                    <Grid item xs={1}>
                        <RteReadOnly value={originalText} />
                    </Grid>
                    <Grid item xs={1}>
                        <Rte value={translatedText} onChange={editTranslation} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={close} color="primary">
                    <FormattedMessage {...messages.cancel} />
                </Button>
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
            </DialogActions>
        </Dialog>
    );
};
