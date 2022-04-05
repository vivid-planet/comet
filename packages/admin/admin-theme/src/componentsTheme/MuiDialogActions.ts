import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";

export const getMuiDialogActions = (palette: Palette): Components["MuiDialogActions"] => ({
    styleOverrides: {
        root: {
            borderTop: `1px solid ${palette.grey[100]}`,
            padding: 20,
            justifyContent: "space-between",

            "&>:first-child:last-child": {
                marginLeft: "auto",
            },
        },
    },
});
