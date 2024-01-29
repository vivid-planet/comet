import { useContentTranslationService } from "@comet/admin";
import { Translate } from "@comet/admin-icons";
import Tooltip from "@mui/material/Tooltip";
import { convertToRaw } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import ControlButton from "../Controls/ControlButton";
import { IControlProps } from "../types";
import { transformStateToXml } from "./xml/transformStateToXml";
import { translateAndTransformXmlToState } from "./xml/translateAndTransformToState";

function ToolbarButton({ editorState, setEditorState, options }: IControlProps): React.ReactElement {
    const translationContext = useContentTranslationService();

    async function handleClick(event: React.MouseEvent) {
        if (translationContext) {
            event.preventDefault();

            const contentState = editorState.getCurrentContent();

            const xml = transformStateToXml(contentState, options.customInlineStyles);

            const translationPromises = xml.map(async (item) => ({
                original: item,
                replaceWith: (await translationContext.translate(item)) ?? item,
            }));
            const translations = await Promise.all(translationPromises);

            const translatedState = translateAndTransformXmlToState(contentState, convertToRaw(contentState), translations);

            setEditorState(translatedState);
        }
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
