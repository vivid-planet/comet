import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../messages";

interface TranslationDialogBaseProps<T> {
    open: boolean;
    onClose: () => void;
    originalText: T;
    translatedText: T;
    onApplyTranslation: (value: T) => void;
    renderOriginalText: (text: T) => JSX.Element;
    renderTranslatedText: (text: T, onChange: (value: T) => void) => JSX.Element;
}

export const BaseTranslationDialog = <T,>(props: TranslationDialogBaseProps<T>) => {
    const { open, onClose, originalText, translatedText, onApplyTranslation, renderOriginalText, renderTranslatedText } = props;
    const [translation, setTranslation] = React.useState(translatedText);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                <FormattedMessage id="comet.translator.translation" defaultMessage="Translation" />
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={4} columns={2} alignItems="center">
                    <Grid item xs={1}>
                        <Typography variant="h6">
                            <FormattedMessage id="comet.translator.translation" defaultMessage="Original" />
                        </Typography>
                        {renderOriginalText(originalText)}
                    </Grid>
                    <Grid item xs={1}>
                        <Typography variant="h6">
                            <FormattedMessage id="comet.translator.translation" defaultMessage="Translation" />
                        </Typography>
                        {renderTranslatedText(translation, setTranslation)}
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
