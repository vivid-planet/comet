import { PaletteColor, SimplePaletteColorOptions } from "@mui/material/styles";
import { ColorPartial } from "@mui/material/styles/createPalette";

export const primaryPalette: PaletteColor = {
    light: "#53C4F7",
    main: "#29B6F6",
    dark: "#1C7FAC",
    contrastText: "#000000",
};

export const errorPalette: SimplePaletteColorOptions = {
    light: "#DA4533",
    main: "#D11700",
    dark: "#921000",
    contrastText: "#ffffff",
};

export const warningPalette: SimplePaletteColorOptions = {
    light: "#FFC247",
    main: "#FFB31A",
    dark: "#EC9213",
    contrastText: "#000000",
};

export const infoPalette: SimplePaletteColorOptions = { ...primaryPalette };

export const successPalette: SimplePaletteColorOptions = {
    light: "#43D65B",
    main: "#14CC33",
    dark: "#0E8E23",
    contrastText: "#000000",
};

export const secondaryPalette = { ...successPalette };

export const greyPalette: ColorPartial = {
    50: "#F2F2F2",
    100: "#D9D9D9",
    200: "#B3B3B3",
    300: "#828282",
    400: "#676767",
    500: "#4C4C4C",
    600: "#454545",
    700: "#3C3C3C",
    800: "#333333",
    900: "#242424",
    A100: "#5A697E",
    A200: "#2E3440",
    A400: "#050D1A",
    A700: "#00050D",
};
