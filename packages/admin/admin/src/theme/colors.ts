import type { Color, PaletteColor, SimplePaletteColorOptions } from "@mui/material/styles";

// The values of the Dextinity theme of @dextinity/ui, so the components that are still MUI look like the rebuilt ones.
export const primaryPalette: PaletteColor = {
    light: "#ecebfe",
    main: "#403af2",
    dark: "#332fc2",
    contrastText: "#ffffff",
};

export const secondaryPalette = {
    light: "#626873",
    main: "#141517",
    dark: "#000000",
    contrastText: "#FFFFFF",
};

export const errorPalette: SimplePaletteColorOptions = {
    light: "#fee2e5",
    main: "#b8283f",
    dark: "#8f1f31",
    contrastText: "#ffffff",
};

export const warningPalette: SimplePaletteColorOptions = {
    light: "#fff4d6",
    main: "#8a5f00",
    dark: "#6b4a00",
    contrastText: "#ffffff",
};

export const infoPalette: SimplePaletteColorOptions = { ...primaryPalette };

export const successPalette: SimplePaletteColorOptions = {
    light: "#e8f5e3",
    main: "#3d7a2b",
    dark: "#2f5f21",
    contrastText: "#ffffff",
};

// Copied from https://github.com/mui/material-ui/blob/d70a45a3f2cc87521b5822bbe2b40b9b054c22f9/packages/mui-material/src/styles/createPalette.d.ts#L27
type ColorPartial = Partial<Color>;

export const greyPalette: ColorPartial = {
    50: "#F5F6F7",
    100: "#E5E6E8",
    200: "#B9BCC2",
    300: "#81868F",
    400: "#626873",
    500: "#4E535C",
    600: "#3E424A",
    700: "#2E3138",
    800: "#202228",
    900: "#141517",
    A100: "#5A697E",
    A200: "#2E3440",
    A400: "#050D1A",
    A700: "#00050D",
};
