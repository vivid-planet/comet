import { PaletteColor, SimplePaletteColorOptions } from "@mui/material/styles";
import { ColorPartial } from "@mui/material/styles/createPalette";

export const bluePalette: PaletteColor = {
    light: "#73E8FF",
    main: "#29B6F6",
    dark: "#0086C3",
    contrastText: "#ffffff",
};

export const greenPalette: PaletteColor = {
    light: "#65FF66",
    main: "#14CC33",
    dark: "#009A00",
    contrastText: "#ffffff",
};

export const errorPalette: SimplePaletteColorOptions = {
    main: "#E63917",
    dark: "#A02710",
    contrastText: "#ffffff",
};

export const successPalette: SimplePaletteColorOptions = {
    main: "#2F8C00",
    dark: "#226600",
};

export const infoPalette: SimplePaletteColorOptions = {
    main: "#009FBF",
};

export const neutrals: ColorPartial = {
    50: "#F2F2F2",
    100: "#D9D9D9",
    200: "#B3B3B3",
    300: "#828282",
    400: "#676767",
    500: "#4C4C4C",
    600: "#404040",
    700: "#2E2E2E",
    800: "#1A1A1A",
    900: "#0F0F0F",
    A100: "#FFFFFF",
    A200: "#2E3440",
    A400: "#050D1A",
    A700: "#00050D",
};

export const warningPalette: SimplePaletteColorOptions = {
    main: "#FFBF00",
};
