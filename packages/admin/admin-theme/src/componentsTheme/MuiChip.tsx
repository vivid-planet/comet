import { Clear } from "@comet/admin-icons";
import React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiChip: GetMuiComponentTheme<"MuiChip"> = (component, { palette, spacing }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiChip">(component?.styleOverrides, {
        root: {
            borderRadius: 12,
            padding: "4px 10px",
        },
        sizeMedium: {
            height: 24,
        },
        iconMedium: {
            margin: 0,
            fontSize: 16,
        },
        labelMedium: {
            fontSize: 12,
            lineHeight: "16px",
            padding: "0 6px",
        },
        deleteIconMedium: {
            margin: 0,
            fontSize: 16,
        },
        disabled: {
            opacity: 0.5,
        },
        // filledDefault: {
        //     backgroundColor: palette.grey["100"],
        //
        //     ["&:hover"]: {
        //         backgroundColor: palette.grey["200"],
        //     },
        // },
        // filledPrimary: {
        //     backgroundColor: palette.primary.main,
        //
        //     ["&:hover"]: {
        //         backgroundColor: palette.primary.dark,
        //     },
        // },
    }),
    defaultProps: {
        deleteIcon: <Clear />,
    },
});
