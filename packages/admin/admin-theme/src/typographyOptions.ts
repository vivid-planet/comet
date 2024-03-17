import { TypographyOptions } from "@mui/material/styles/createTypography";

const fontFamily = "Roboto, Helvetica, Arial, sans-serif";

export const fontWeights = {
    fontWeightLight: 100,
    fontWeightSemiLight: 200,
    fontWeightRegular: 300,
    fontWeightMedium: 400,
    fontWeightBold: 500,
};

const body1Styles = {
    fontFamily,
    fontSize: 16,
    lineHeight: "20px",
    fontWeight: fontWeights.fontWeightRegular,
};

export const typographyOptions: TypographyOptions = {
    ...fontWeights,
    h1: {
        fontFamily,
        fontSize: 36,
        lineHeight: "42px",
        fontWeight: fontWeights.fontWeightLight,

        "@media (min-width: 900px)": {
            fontSize: 55,
            lineHeight: "64px",
        },
    },
    h2: {
        fontFamily,
        fontSize: 30,
        lineHeight: "38px",
        fontWeight: fontWeights.fontWeightSemiLight,

        "@media (min-width: 900px)": {
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

        "@media (min-width: 900px)": {
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

        "@media (min-width: 900px)": {
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

        "@media (min-width: 900px)": {
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

        "@media (min-width: 900px)": {
            fontSize: 16,
            lineHeight: "20px",
        },
    },
    body1: body1Styles,
    body2: {
        fontFamily,
        fontSize: 14,
        lineHeight: "20px",
        fontWeight: fontWeights.fontWeightRegular,
    },
    list: {
        paddingInlineStart: 30,
        paddingTop: 8,
        paddingBottom: 8,
    },
    listItem: {
        ...body1Styles,
        paddingLeft: 0,
        paddingTop: 4,
        paddingBottom: 4,
    },
};

declare module "@mui/material/styles" {
    interface TypographyVariants {
        list: React.CSSProperties;
        listItem: React.CSSProperties;
    }

    interface TypographyVariantsOptions {
        list?: React.CSSProperties;
        listItem?: React.CSSProperties;
    }
}

declare module "@mui/material/Typography" {
    interface TypographyPropsVariantOverrides {
        list: true;
        listItem: true;
    }
}
