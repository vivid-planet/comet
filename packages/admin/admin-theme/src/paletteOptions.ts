import { PaletteOptions } from "@mui/material/styles";

import { errorPalette, greyPalette, infoPalette, primaryPalette, successPalette, warningPalette } from "./colors";

export const paletteOptions: PaletteOptions = {
    primary: primaryPalette,
    error: errorPalette,
    warning: warningPalette,
    info: infoPalette,
    success: successPalette,
    grey: greyPalette,
    divider: greyPalette[100],
    text: {
        primary: greyPalette[900],
        secondary: greyPalette[300],
        disabled: greyPalette[200],
    },
    background: {
        default: greyPalette[50],
    },
    action: {
        active: greyPalette[400],
        disabled: greyPalette[200],
    },
};
