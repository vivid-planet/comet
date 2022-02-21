import { dialogTitleClasses } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiDialogContent = (palette: Palette): Components["MuiDialogContent"] => ({
    styleOverrides: {
        root: {
            backgroundColor: palette.grey[50],
            padding: 40,

            [`.${dialogTitleClasses.root} + &`]: {
                paddingTop: 40,
            },
        },
    },
});
