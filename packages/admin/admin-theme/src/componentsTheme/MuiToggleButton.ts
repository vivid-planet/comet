import { toggleButtonClasses } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiToggleButton = (palette: Palette): Components["MuiToggleButton"] => ({
    styleOverrides: {
        root: {
            borderColor: palette.grey[100],

            [`&.${toggleButtonClasses.selected}`]: {
                backgroundColor: "transparent",
                borderBottom: `2px solid ${palette.primary.main}`,
                color: palette.primary.main,
            },
        },
    },
});
