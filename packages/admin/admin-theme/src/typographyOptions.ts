import { Breakpoints } from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";

const fontFamily = "Roboto, Helvetica, Arial, sans-serif";

// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping
export const fontWeights = {
    thin: 100,
    extraLight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
    extraBlack: 950,
};

export const createTypographyOptions = (breakpoints: Breakpoints): TypographyOptions => ({
    fontFamily,
    ...fontWeights,
    h1: {
        fontFamily,
        fontSize: 36,
        lineHeight: "42px",
        fontWeight: fontWeights.thin,

        [breakpoints.up("md")]: {
            fontSize: 55,
            lineHeight: "64px",
        },
    },
    h2: {
        fontFamily,
        fontSize: 30,
        lineHeight: "38px",
        fontWeight: fontWeights.extraLight,

        [breakpoints.up("md")]: {
            fontSize: 44,
            lineHeight: "52px",
            fontWeight: fontWeights.thin,
        },
    },
    h3: {
        fontFamily,
        fontSize: 24,
        lineHeight: "28px",
        fontWeight: fontWeights.light,

        [breakpoints.up("md")]: {
            fontSize: 33,
            lineHeight: "39px",
            fontWeight: fontWeights.thin,
        },
    },
    h4: {
        fontFamily,
        fontSize: 20,
        lineHeight: "26px",
        fontWeight: fontWeights.light,

        [breakpoints.up("md")]: {
            fontSize: 24,
            lineHeight: "28px",
            fontWeight: fontWeights.extraLight,
        },
    },
    h5: {
        fontFamily,
        fontSize: 16,
        lineHeight: "20px",
        fontWeight: fontWeights.regular,

        [breakpoints.up("md")]: {
            fontSize: 18,
            lineHeight: "21px",
            fontWeight: fontWeights.light,
        },
    },
    h6: {
        fontFamily,
        fontSize: 14,
        lineHeight: "18px",
        fontWeight: fontWeights.medium,

        [breakpoints.up("md")]: {
            fontSize: 16,
            lineHeight: "20px",
        },
    },
    subtitle1: {
        fontFamily,
        fontSize: 16,
        lineHeight: "20px",
        fontWeight: fontWeights.semiBold,
    },
    subtitle2: {
        fontFamily,
        fontSize: 14,
        lineHeight: "20px",
        fontWeight: fontWeights.semiBold,
    },
    body1: {
        fontFamily,
        fontSize: 16,
        lineHeight: "20px",
        fontWeight: fontWeights.light,
    },
    body2: {
        fontFamily,
        fontSize: 14,
        lineHeight: "20px",
        fontWeight: fontWeights.light,
    },
    caption: {
        fontFamily,
        fontSize: 12,
        lineHeight: "16px",
        fontWeight: fontWeights.regular,
    },
    overline: {
        fontFamily,
        fontSize: 12,
        lineHeight: "16px",
        fontWeight: fontWeights.semiBold,
    },
});
