import { Clear } from "@comet/admin-icons";
import { Components } from "@mui/material/styles/components";
import { Spacing } from "@mui/system";
import * as React from "react";

export const getMuiAutocomplete = (spacing: Spacing): Components["MuiAutocomplete"] => ({
    defaultProps: {
        clearIcon: <Clear color="action" />,
    },
    styleOverrides: {
        endAdornment: {
            top: "auto",
            right: spacing(2),
        },
    },
});
