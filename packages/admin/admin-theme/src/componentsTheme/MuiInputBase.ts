import { inputBaseClasses, svgIconClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiInputBase: GetMuiComponentTheme<"MuiInputBase"> = (styleOverrides, { palette, spacing }) => ({
    styleOverrides: mergeOverrideStyles<"MuiInputBase">(styleOverrides, {
        root: {
            border: `1px solid ${palette.grey[100]}`,
            borderRadius: 2,
            backgroundColor: "#fff",

            [`& .${svgIconClasses.root}`]: {
                pointerEvents: "none",
            },
            "& [class*='CometAdminClearInputButton-root']": {
                marginRight: spacing(-2),
                marginLeft: spacing(-2),

                [`& .${svgIconClasses.root}`]: {
                    pointerEvents: "auto",
                },
            },
            [`&.${inputBaseClasses.focused}`]: {
                borderColor: palette.primary.main,
            },
        },
        adornedStart: {
            paddingLeft: spacing(2),
        },
        adornedEnd: {
            paddingRight: spacing(2),
        },
        multiline: {
            paddingTop: 0,
            paddingBottom: 0,
        },
        input: {
            height: "auto",
            boxSizing: "border-box",
            padding: `calc(${spacing(2)} - 1px)`,
            lineHeight: "20px",

            "&::-ms-clear": {
                display: "none",
            },
        },
        inputMultiline: {
            padding: `calc(${spacing(2)} - 1px)`,
        },
        inputAdornedStart: {
            paddingLeft: spacing(2),
        },
        inputAdornedEnd: {
            paddingRight: spacing(2),
        },
    }),
});
