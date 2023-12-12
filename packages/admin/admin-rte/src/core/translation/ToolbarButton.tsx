import { useTranslationConfig } from "@comet/admin";
import TranslateIcon from "@mui/icons-material/Translate";
import Tooltip from "@mui/material/Tooltip";
import { convertToRaw } from "draft-js";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import ControlButton from "../Controls/ControlButton";
import { IControlProps } from "../types";
import { transformStateToXml } from "./xml/transformStateToXml";
import { translateAndTransformXmlToState } from "./xml/translateAndTransformToState";

function ToolbarButton({ editorState, setEditorState }: IControlProps): React.ReactElement {
    const { translate } = useTranslationConfig();

    async function handleClick(event: React.MouseEvent) {
        event.preventDefault();

        const contentState = editorState.getCurrentContent();

        const xml = transformStateToXml(contentState);

        if (translate) {
            const translationPromises = xml.map(async (item) => ({ original: item, replaceWith: (await translate(item)) ?? item }));
            const translations = await Promise.all(translationPromises);

            const translatedState = translateAndTransformXmlToState(contentState, convertToRaw(contentState), translations);

            setEditorState(translatedState);
        }
    }

    return (
        <Tooltip title={<FormattedMessage id="comet.rte.translation.buttonTooltip" defaultMessage="Translate" />} placement="top">
            <span>
                <ControlButton icon={TranslateIcon} onButtonClick={handleClick} />
            </span>
        </Tooltip>
    );
}

export default ToolbarButton;
