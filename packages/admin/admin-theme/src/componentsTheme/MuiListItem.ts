import { Components } from "@mui/material/styles/components";

export const getMuiListItem = (): Components["MuiListItem"] => ({
    defaultProps: {
        dense: true,
    },
});
