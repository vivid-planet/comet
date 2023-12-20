import { useContentTranslationService } from "@comet/admin";
import { ButtonGroup } from "@mui/material";
import * as React from "react";

import TranslationToolbarButton from "../translation/ToolbarButton";
import { IControlProps } from "../types";

function TranslationControls(props: IControlProps) {
    const translationContext = useContentTranslationService();

    return <ButtonGroup>{translationContext && <TranslationToolbarButton {...props} />}</ButtonGroup>;
}

export default TranslationControls;
