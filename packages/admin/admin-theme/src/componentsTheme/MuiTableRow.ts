import { Components } from "@mui/material/styles/components";

export const getMuiTableRow = (): Components["MuiTableRow"] => ({
    styleOverrides: {
        root: {
            backgroundColor: "#fff",
        },
    },
});
