import { Breakpoints } from "@mui/material";
import { TypographyOptions } from "@mui/material/styles/createTypography";

const fontFamily = "Roboto, Helvetica, Arial, sans-serif";

export const fontWeights = {
    fontWeightLight: 100,
    fontWeightSemiLight: 200,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
};

export const createTypographyOptions = (breakpoints: Breakpoints): TypographyOptions => ({
    fontFamily,
    ...fontWeights,
    h1: {
        fontFamily,
        fontSize: 36,
        lineHeight: "42px",
        fontWeight: fontWeights.fontWeightLight,

        [breakpoints.up("md")]: {
            fontSize: 55,
            lineHeight: "64px",
        },
    },
    h2: {
        fontFamily,
        fontSize: 30,
        lineHeight: "38px",
        fontWeight: fontWeights.fontWeightSemiLight,

        [breakpoints.up("md")]: {
            fontSize: 44,
            lineHeight: "52px",
            fontWeight: fontWeights.fontWeightLight,
        },
    },
    h3: {
        fontFamily,
        fontSize: 24,
        lineHeight: "28px",
        fontWeight: fontWeights.fontWeightRegular,

        [breakpoints.up("md")]: {
            fontSize: 33,
            lineHeight: "39px",
            fontWeight: fontWeights.fontWeightLight,
        },
    },
    h4: {
        fontFamily,
        fontSize: 20,
        lineHeight: "26px",
        fontWeight: fontWeights.fontWeightRegular,

        [breakpoints.up("md")]: {
            fontSize: 24,
            lineHeight: "28px",
            fontWeight: fontWeights.fontWeightSemiLight,
        },
    },
    h5: {
        fontFamily,
        fontSize: 16,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightMedium,

        [breakpoints.up("md")]: {
            fontSize: 18,
            lineHeight: "21px",
            fontWeight: fontWeights.fontWeightRegular,
        },
    },
    h6: {
        fontFamily,
        fontSize: 14,
        lineHeight: "18px",
        fontWeight: fontWeights.fontWeightBold,

        [breakpoints.up("md")]: {
            fontSize: 16,
            lineHeight: "20px",
        },
    },
    body1: {
        fontFamily,
        fontSize: 16,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightRegular,
    },
    body2: {
        fontFamily,
        fontSize: 14,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightRegular,
    },
});
