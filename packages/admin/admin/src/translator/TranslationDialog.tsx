import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, InputBase } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";

interface TranslationDialogProps {
    open: boolean;
    close: () => void;
    originalText: string;
    translatedText: string;
    applyTranslation: (value: string) => void;
}

export const TranslationDialog: React.FC<TranslationDialogProps> = (props) => {
    const { open, close, originalText, translatedText, applyTranslation } = props;

    const [translation, setTranslation] = React.useState<string>(translatedText);

    return (
        <Dialog open={open} onClose={close} fullWidth maxWidth="lg">
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
                <Button
                    onClick={() => {
                        applyTranslation(translation);
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
