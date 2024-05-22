import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputBase } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";

interface TranslationDialogProps {
    open: boolean;
    onClose: () => void;
    originalText: string;
    translatedText: string;
    onApplyTranslation: (value: string) => void;
}

export const TranslationDialog: React.FC<TranslationDialogProps> = (props) => {
    const { open, onClose, originalText, translatedText, onApplyTranslation } = props;

    const [translation, setTranslation] = React.useState<string>(translatedText);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                <FormattedMessage id="comet.translator.translation" defaultMessage="Translation" />
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={4} columns={2} alignItems="center">
                    <Grid item xs={1}>
                        <InputBase value={originalText} disabled fullWidth />
                    </Grid>
                    <Grid item xs={1}>
                        <InputBase value={translation} onChange={(event) => setTranslation(event.target.value)} fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    <FormattedMessage {...messages.cancel} />
                </Button>
                <Button
                    onClick={() => {
                        onApplyTranslation(translation);
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
