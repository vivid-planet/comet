import { Components } from "@mui/material/styles/components";

export const getMuiPopover = (): Components["MuiPopover"] => ({
    defaultProps: {
        elevation: 1,
    },
});
