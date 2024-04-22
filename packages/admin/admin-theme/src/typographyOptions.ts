import { TypographyOptions } from "@mui/material/styles/createTypography";

const fontFamily = "Roboto, Helvetica, Arial, sans-serif";

export const fontWeights = {
    fontWeightThin: 100,
    fontWeightExtraLight: 200,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
};

export const typographyOptions: TypographyOptions = {
    ...fontWeights,
    h1: {
        fontFamily,
        fontSize: 55,
        lineHeight: "64px",
        fontWeight: fontWeights.fontWeightLight,
    },
    h2: {
        fontFamily,
        fontSize: 44,
        lineHeight: "52px",
        fontWeight: fontWeights.fontWeightLight,
    },
    h3: {
        fontFamily,
        fontSize: 33,
        lineHeight: "39px",
        fontWeight: fontWeights.fontWeightLight,
    },
    h4: {
        fontFamily,
        fontSize: 24,
        lineHeight: "28px",
        fontWeight: fontWeights.fontWeightLight,
    },
    h5: {
        fontFamily,
        fontSize: 18,
        lineHeight: "21px",
        fontWeight: fontWeights.fontWeightRegular,
    },
    h6: {
        fontFamily,
        fontSize: 16,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightBold,
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
    subtitle2: {
        fontFamily,
        fontSize: 14,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightSemiBold,
    },
    overline: {
        fontFamily,
        fontSize: 12,
        lineHeight: "16px",
        fontWeight: fontWeights.fontWeightSemiBold,
        letterSpacing: 0,
    },
};
