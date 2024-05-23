import { Clear } from "@comet/admin-icons";
import { chipClasses } from "@mui/material";
import React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiChip: GetMuiComponentTheme<"MuiChip"> = (component, { palette, spacing }) => ({
    ...component,
    styleOverrides: mergeOverrideStyles<"MuiChip">(component?.styleOverrides, {
        root: {
            borderRadius: 12,
            "&.Mui-disabled": {
                opacity: 0.5,
            },
        },
        sizeMedium: {
            height: 24,
            padding: "4px 10px",
        },
        iconMedium: {
            margin: 0,
            fontSize: 16,
            paddingRight: "6px",
        },
        labelMedium: {
            fontSize: 12,
            lineHeight: "16px",
            paddingLeft: 0,
            paddingRight: "6px",
        },
        deleteIconMedium: {
            margin: 0,
            fontSize: 16,
        },
        sizeSmall: {
            height: 20,
            padding: "4px 7px",
        },
        iconSmall: {
            margin: 0,
            fontSize: 12,
            paddingRight: "5px",
        },
        labelSmall: {
            fontSize: 10,
            lineHeight: "10px",
            paddingLeft: 0,
            paddingRight: "5px",
        },
        deleteIconSmall: {
            margin: 0,
            fontSize: 12,
        },
        deleteIconColorPrimary: {
            color: palette.primary.contrastText,
            ["&:hover"]: {
                color: palette.primary.contrastText,
            },
        },
        deleteIconColorSecondary: {
            color: palette.secondary.contrastText,
            ["&:hover"]: {
                color: palette.secondary.contrastText,
            },
        },
        // @ts-expect-error This keys exist but are missing in the types.
        deleteIconColorDefault: {
            color: "black",
            ["&:hover"]: {
                color: "black",
            },
        },
        deleteIconColorSuccess: {
            color: palette.success.contrastText,
            ["&:hover"]: {
                color: palette.success.contrastText,
            },
        },
        deleteIconColorError: {
            color: palette.error.contrastText,
            ["&:hover"]: {
                color: palette.error.contrastText,
            },
        },
        deleteIconColorWarning: {
            color: palette.warning.contrastText,
            ["&:hover"]: {
                color: palette.warning.contrastText,
            },
        },
        deleteIconColorInfo: {
            color: palette.info.contrastText,
            ["&:hover"]: {
                color: palette.info.contrastText,
            },
        },
        filledDefault: {
            backgroundColor: palette.grey["100"],
        },
        outlinedDefault: {
            borderColor: palette.grey["100"],
        },
        clickableColorDefault: {
            [`&.${chipClasses.filled}:hover`]: {
                backgroundColor: palette.grey["200"],
            },
            [`&.${chipClasses.outlined}:hover`]: {
                backgroundColor: palette.grey["50"],
            },
        },
    }),
    defaultProps: {
        deleteIcon: <Clear />,
    },
});
