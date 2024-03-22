import { Tooltip, useContentTranslationService } from "@comet/admin";
import { Translate } from "@comet/admin-icons";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ControlButton } from "../Controls/ControlButton";
import { IControlProps } from "../types";
import { htmlToState } from "./htmlToState";
import { stateToHtml } from "./stateToHtml";

function ToolbarButton({ editorState, setEditorState, options }: IControlProps): React.ReactElement {
    const translationContext = useContentTranslationService();

    async function handleClick(event: React.MouseEvent) {
        if (!translationContext) return;

        event.preventDefault();

        const { html, entities } = stateToHtml({ editorState, options });

        const translation = await translationContext.translate(html);

        const translatedEditorState = htmlToState({ html: translation, entities });

        setEditorState(translatedEditorState);
    }

    return (
        <Tooltip title={<FormattedMessage id="comet.rte.translation.buttonTooltip" defaultMessage="Translate" />} placement="top">
            <span>
                <ControlButton icon={Translate} onButtonClick={handleClick} />
            </span>
        </Tooltip>
    );
}

export default ToolbarButton;
