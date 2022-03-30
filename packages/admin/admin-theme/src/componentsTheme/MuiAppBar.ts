import { Components } from "@mui/material/styles/components";

export const getMuiAppBar = (): Components["MuiAppBar"] => ({
    defaultProps: {
        elevation: 0,
    },
});
