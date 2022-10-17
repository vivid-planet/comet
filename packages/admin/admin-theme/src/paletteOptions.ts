import { PaletteOptions } from "@mui/material/styles";

import { bluePalette, errorPalette, greenPalette, infoPalette, neutrals, successPalette } from "./colors";

export const paletteOptions: PaletteOptions = {
    primary: bluePalette,
    secondary: greenPalette,
    error: errorPalette,
    success: successPalette,
    info: infoPalette,
    grey: neutrals,
    divider: neutrals[100],
    text: {
        primary: neutrals[900],
        secondary: "#757575",
        disabled: neutrals[300],
    },
    background: {
        default: neutrals[50],
    },
    action: {
        active: neutrals[400],
        disabled: neutrals[200],
    },
};
