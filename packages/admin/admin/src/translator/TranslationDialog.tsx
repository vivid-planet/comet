import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputBase } from "@mui/material";
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
        <Dialog open={open} onClose={close}>
            <DialogTitle>
                <FormattedMessage id="comet.translator.translation" defaultMessage="Translation" />
            </DialogTitle>
            <DialogContent>
                <TwoColumnLayout
                    leftContent={<InputBase value={originalText} disabled />}
                    rightContent={<InputBase value={translation} onChange={(event) => setTranslation(event.target.value)} />}
                />
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

const TwoColumnLayout = ({ leftContent, rightContent }: { leftContent: JSX.Element; rightContent: JSX.Element }) => {
    return (
        <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>{leftContent}</div>
            <div style={{ flex: 1 }}>{rightContent}</div>
        </div>
    );
};
