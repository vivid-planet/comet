import { ButtonGroup } from "@mui/material";
import * as React from "react";

import NonBreakingSpaceToolbarButton from "../extension/NonBreakingSpace/ToolbarButton";
import { IControlProps } from "../types";

function SpecialCharactersControls(props: IControlProps) {
    const {
        options: { supports: supportedThings },
    } = props;

    if (!supportedThings.includes("non-breaking-space")) {
        return null;
    }

    return <ButtonGroup>{supportedThings.includes("non-breaking-space") && <NonBreakingSpaceToolbarButton {...props} />}</ButtonGroup>;
}

export default SpecialCharactersControls;
