import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { ColorPickerProps } from "./ColorPicker";

export type ColorPickerClassKey =
    | "popperRoot"
    | "colorPickerWrapper"
    | "colorPalette"
    | "colorPaletteItem"
    | "preview"
    | "previewIndicator"
    | "previewIndicatorColor"
    | "previewIndicatorEmpty"
    | "previewIndicatorInvalid";

const emptyIndicatorLineColor = "red";
const emptyIndicatorLineWidth = 2;

export const styles = (theme: Theme) => {
    return createStyles<ColorPickerClassKey, ColorPickerProps>({
        popperRoot: {
            width: 255,
        },
        colorPickerWrapper: {
            "& .react-colorful": {
                width: "100%",
                height: 220,

                "&__saturation, &__hue, &__alpha": {
                    borderRadius: 0,
                },
            },
        },
        colorPalette: {
            display: "flex",
            flexWrap: "wrap",
            padding: theme.spacing(2),
            gap: theme.spacing(1),
        },
        colorPaletteItem: {
            cursor: "pointer",
            width: 25,
            height: 25,
            flexShrink: 0,
            border: `thin solid ${theme.palette.divider}`,
            boxSizing: "border-box",
        },
        preview: {
            position: "relative",
            overflow: "hidden",
            width: 24,
            height: 24,
        },
        previewIndicator: {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            border: `thin solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
        },
        previewIndicatorColor: {},
        previewIndicatorEmpty: {
            background: `linear-gradient(to top left, transparent 0%, transparent calc(50% - ${
                emptyIndicatorLineWidth / 2
            }px), ${emptyIndicatorLineColor} calc(50% - ${emptyIndicatorLineWidth / 2}px), ${emptyIndicatorLineColor} calc(50% + ${
                emptyIndicatorLineWidth / 2
            }px), transparent calc(50% + ${emptyIndicatorLineWidth / 2}px), transparent 100%)`,
        },
        previewIndicatorInvalid: {
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: theme.typography.fontWeightBold,
            color: theme.palette.text.secondary,
            textAlign: "center",
        },
    });
};
