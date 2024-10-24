import { Tooltip, useContentTranslationService } from "@comet/admin";
import { Translate } from "@comet/admin-icons";
import { EditorState } from "draft-js";
import { MouseEvent, useState } from "react";
import { FormattedMessage } from "react-intl";

import { ControlButton } from "../Controls/ControlButton";
import { IControlProps } from "../types";
import { EditorStateTranslationDialog } from "./EditorStateTranslationDialog";
import { htmlToState } from "./htmlToState";
import { stateToHtml } from "./stateToHtml";

function ToolbarButton({ editorState, setEditorState, options }: IControlProps) {
    const translationContext = useContentTranslationService();

    const [open, setOpen] = useState<boolean>(false);
    const [pendingTranslation, setPendingTranslation] = useState<EditorState | undefined>(undefined);

    async function handleClick(event: MouseEvent) {
        if (!translationContext) return;

        event.preventDefault();

        const { html, entities } = stateToHtml({ editorState, options });

        const translation = await translationContext.translate(html);

        const translatedEditorState = htmlToState({ html: translation, entities });

        if (translationContext.showApplyTranslationDialog) {
            setPendingTranslation(translatedEditorState);
            setOpen(true);
        } else {
            setEditorState(translatedEditorState);
        }
    }

    return (
        <>
            <Tooltip title={<FormattedMessage id="comet.rte.translation.buttonTooltip" defaultMessage="Translate" />} placement="top">
                <span>
                    <ControlButton icon={Translate} onButtonClick={handleClick} />
                </span>
            </Tooltip>
            {open && pendingTranslation && (
                <EditorStateTranslationDialog
                    open={open}
                    onClose={() => setOpen(false)}
                    originalText={editorState}
                    translatedText={pendingTranslation}
                    onApplyTranslation={setEditorState}
                />
            )}
        </>
    );
}

export default ToolbarButton;
