import { Components } from "@mui/material/styles/components";

export const getMuiFormControlLabel = (): Components["MuiFormControlLabel"] => ({
    styleOverrides: {
        root: {
            marginLeft: -9,
            marginTop: -7,
            marginBottom: -7,
        },
    },
});
