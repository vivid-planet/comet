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
        if (!translationContext) return;

        event.preventDefault();

        const contentState = editorState.getCurrentContent();

        const xml = transformStateToXml(contentState, options.customInlineStyles);

        const translations = (await translationContext.translate(xml.join("<split />"))).split("<split />");

        if (xml.length === translations.length) {
            const translationMap = xml.map((original, index) => ({ original, replaceWith: translations[index] }));

            const translatedState = translateAndTransformXmlToState(contentState, convertToRaw(contentState), translationMap);

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
