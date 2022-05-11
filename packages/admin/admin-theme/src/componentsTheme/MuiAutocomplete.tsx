import { Clear } from "@comet/admin-icons";
import * as React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiAutocomplete: GetMuiComponentTheme<"MuiAutocomplete"> = (styleOverrides, { spacing }) => ({
    defaultProps: {
        clearIcon: <Clear color="action" />,
    },
    styleOverrides: mergeOverrideStyles<"MuiAutocomplete">(styleOverrides, {
        endAdornment: {
            top: "auto",
            right: spacing(2),
        },
    }),
});
