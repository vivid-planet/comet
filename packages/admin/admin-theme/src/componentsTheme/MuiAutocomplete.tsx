import { Clear } from "@comet/admin-icons";
import * as React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiAutocomplete: GetMuiComponentTheme<"MuiAutocomplete"> = (component, { spacing }) => ({
    ...component,
    defaultProps: {
        clearIcon: <Clear color="action" />,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiAutocomplete">(component?.styleOverrides, {
        endAdornment: {
            top: "auto",
            right: spacing(2),
        },
    }),
});
