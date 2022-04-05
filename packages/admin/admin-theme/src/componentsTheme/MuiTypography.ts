import { Components } from "@mui/material/styles/components";

export const getMuiTypography = (): Components["MuiTypography"] => ({
    styleOverrides: {
        gutterBottom: {
            marginBottom: 20,
        },
    },
});
