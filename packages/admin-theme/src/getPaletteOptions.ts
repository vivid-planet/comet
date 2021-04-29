import { PaletteOptions } from "@material-ui/core/styles/createPalette";

import { bluePalette, errorPalette, greenPalette, infoPalette, neutrals, successPalette } from "./colors";

export default (): PaletteOptions => ({
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
});
