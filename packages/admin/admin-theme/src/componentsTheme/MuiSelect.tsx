import { ChevronDown } from "@comet/admin-icons";
import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";
import * as React from "react";

export const getMuiSelect = (palette: Palette): Components["MuiSelect"] => ({
    defaultProps: {
        IconComponent: ({ className }) => <ChevronDown classes={{ root: className }} />,
    },
    styleOverrides: {
        select: {
            paddingRight: 32,

            "&:focus": {
                backgroundColor: "transparent",
            },
        },
        icon: {
            top: "calc(50% - 8px)",
            right: 12,
            fontSize: 12,
            color: palette.grey[900],
        },
    },
});
