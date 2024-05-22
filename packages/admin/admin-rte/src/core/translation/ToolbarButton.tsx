import { Tooltip, useContentTranslationService } from "@comet/admin";
import { Translate } from "@comet/admin-icons";
import { EditorState } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import ControlButton from "../Controls/ControlButton";
import { IControlProps } from "../types";
import { EditorStateTranslationDialog } from "./EditorStateTranslationDialog";
import { htmlToState } from "./htmlToState";
import { stateToHtml } from "./stateToHtml";

function ToolbarButton({ editorState, setEditorState, options }: IControlProps): React.ReactElement {
    const translationContext = useContentTranslationService();

    const [pendingEditorState, setPendingEditorState] = React.useState<boolean>(false);
    const [translationEditorState, setTranslationEditorState] = React.useState<EditorState | undefined>(undefined);

    async function handleClick(event: React.MouseEvent) {
        if (!translationContext) return;

        event.preventDefault();

        const { html, entities } = stateToHtml({ editorState, options });

        const translation = await translationContext.translate(html);

        const translatedEditorState = htmlToState({ html: translation, entities });

        if (translationContext.showApplyTranslationDialog) {
            setTranslationEditorState(translatedEditorState);
            setPendingEditorState(true);
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
            {pendingEditorState && translationEditorState && (
                <EditorStateTranslationDialog
                    open={pendingEditorState}
                    onClose={() => setPendingEditorState(false)}
                    originalText={editorState}
                    translatedText={translationEditorState}
                    onApplyTranslation={setEditorState}
                />
            )}
        </>
    );
}

export default ToolbarButton;
