import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { ColorPickerProps } from "./ColorPicker";

export type ColorPickerClassKey =
    | "popperRoot"
    | "popperSection"
    | "header"
    | "headerTitleText"
    | "headerCloseButton"
    | "colorPickerWrapper"
    | "colorPalette"
    | "colorPaletteItem"
    | "footer"
    | "footerClearButton"
    | "preview"
    | "previewIndicator"
    | "previewIndicatorColor"
    | "previewIndicatorEmpty"
    | "previewIndicatorInvalid";

export const styles = ({ typography, palette, shape, spacing }: Theme) => {
    return createStyles<ColorPickerClassKey, ColorPickerProps>({
        popperRoot: {
            width: 300,
        },
        popperSection: {
            padding: spacing(3),

            "&:not(:last-child)": {
                borderBottom: `thin solid ${palette.grey[100]}`,
            },
        },
        header: {
            position: "relative",
            paddingRight: 40,
        },
        headerTitleText: {
            fontWeight: typography.fontWeightBold,
        },
        headerCloseButton: {
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            right: spacing(2),
        },
        colorPickerWrapper: {
            "& .react-colorful": {
                width: "100%",
                height: "auto",

                "&__pointer": {
                    width: 30,
                    height: 30,
                },

                "&__saturation, &__hue, &__alpha": {
                    borderRadius: 0,

                    "&:not(:last-child)": {
                        marginBottom: spacing(3),
                    },
                },

                "&__saturation": {
                    borderBottom: "none",
                    height: 270,
                },

                "&__hue, &__alpha": {
                    height: 20,
                },

                "&__alpha-gradient": {
                    boxShadow: "none",
                },
            },
        },
        colorPalette: {
            display: "flex",
            flexWrap: "wrap",
            gap: spacing(1),
        },
        colorPaletteItem: {
            cursor: "pointer",
            width: 24,
            height: 24,
            flexShrink: 0,
            border: `thin solid ${palette.grey[100]}`,
            borderRadius: shape.borderRadius,
            boxSizing: "border-box",
        },
        footer: {
            padding: spacing(1),
        },
        footerClearButton: {
            padding: spacing(2),
            borderRadius: shape.borderRadius,

            "& $preview": {
                marginRight: 8,
            },
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
            border: `thin solid ${palette.divider}`,
            borderRadius: shape.borderRadius,
        },
        previewIndicatorColor: {},
        previewIndicatorEmpty: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            "&:before": {
                content: "''",
                display: "block",
                backgroundColor: "#F62929",
                width: 1,
                height: "calc(100% - 4px)",
                transform: "rotate(45deg)",
            },
        },
        previewIndicatorInvalid: {
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: typography.fontWeightBold,
            color: palette.text.secondary,
            textAlign: "center",
        },
    });
};
