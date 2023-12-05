import { useTranslationConfig } from "@comet/admin";
import { ButtonGroup } from "@mui/material";
import * as React from "react";

import TranslationToolbarButton from "../translation/ToolbarButton";
import { IControlProps } from "../types";

function TranslationControls(props: IControlProps) {
    const { enableTranslation } = useTranslationConfig();

    return <ButtonGroup>{enableTranslation && <TranslationToolbarButton {...props} />}</ButtonGroup>;
}

export default TranslationControls;
