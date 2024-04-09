import { Breakpoints } from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";

const fontFamily = "Roboto, Helvetica, Arial, sans-serif";

// https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight#common_weight_name_mapping
export const fontWeights = {
    fontWeightThin: 100,
    fontWeightExtraLight: 200,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
};

export const createTypographyOptions = (breakpoints: Breakpoints): TypographyOptions => ({
    fontFamily,
    ...fontWeights,
    h1: {
        fontFamily,
        fontSize: 36,
        lineHeight: "42px",
        fontWeight: fontWeights.fontWeightThin,

        [breakpoints.up("md")]: {
            fontSize: 55,
            lineHeight: "64px",
        },
    },
    h2: {
        fontFamily,
        fontSize: 30,
        lineHeight: "38px",
        fontWeight: fontWeights.fontWeightExtraLight,

        [breakpoints.up("md")]: {
            fontSize: 44,
            lineHeight: "52px",
            fontWeight: fontWeights.fontWeightThin,
        },
    },
    h3: {
        fontFamily,
        fontSize: 24,
        lineHeight: "28px",
        fontWeight: fontWeights.fontWeightLight,

        [breakpoints.up("md")]: {
            fontSize: 33,
            lineHeight: "39px",
            fontWeight: fontWeights.fontWeightThin,
        },
    },
    h4: {
        fontFamily,
        fontSize: 20,
        lineHeight: "26px",
        fontWeight: fontWeights.fontWeightLight,

        [breakpoints.up("md")]: {
            fontSize: 24,
            lineHeight: "28px",
            fontWeight: fontWeights.fontWeightExtraLight,
        },
    },
    h5: {
        fontFamily,
        fontSize: 16,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightRegular,

        [breakpoints.up("md")]: {
            fontSize: 18,
            lineHeight: "21px",
            fontWeight: fontWeights.fontWeightLight,
        },
    },
    h6: {
        fontFamily,
        fontSize: 14,
        lineHeight: "18px",
        fontWeight: fontWeights.fontWeightMedium,

        [breakpoints.up("md")]: {
            fontSize: 16,
            lineHeight: "20px",
        },
    },
    subtitle1: {
        fontFamily,
        fontSize: 16,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightSemiBold,
    },
    subtitle2: {
        fontFamily,
        fontSize: 14,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightSemiBold,
    },
    body1: {
        fontFamily,
        fontSize: 16,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightLight,
    },
    body2: {
        fontFamily,
        fontSize: 14,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightLight,
    },
    caption: {
        fontFamily,
        fontSize: 12,
        lineHeight: "16px",
        fontWeight: fontWeights.fontWeightRegular,
    },
    overline: {
        fontFamily,
        fontSize: 12,
        lineHeight: "16px",
        fontWeight: fontWeights.fontWeightSemiBold,
    },
});
