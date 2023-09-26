import { InputBase } from "@mui/material";
import React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { commonSelectDefaultProps, commonSelectStyleOverrides, getCommonIconStyleOverrides } from "./getCommonSelectTheme";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiSelect: GetMuiComponentTheme<"MuiSelect"> = (component, { palette }) => ({
    ...component,
    defaultProps: {
        ...commonSelectDefaultProps,
        input: <InputBase />,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiSelect">(component?.styleOverrides, {
        select: commonSelectStyleOverrides,
        icon: getCommonIconStyleOverrides(palette),
    }),
});
