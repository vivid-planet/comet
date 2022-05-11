import { ChevronDown } from "@comet/admin-icons";
import * as React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiSelect: GetMuiComponentTheme<"MuiSelect"> = (styleOverrides, { palette }) => ({
    defaultProps: {
        IconComponent: ({ className }) => <ChevronDown classes={{ root: className }} />,
    },
    styleOverrides: mergeOverrideStyles<"MuiSelect">(styleOverrides, {
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
    }),
});
