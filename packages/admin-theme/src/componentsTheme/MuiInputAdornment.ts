import { Components } from "@mui/material/styles/components";

export const getMuiInputAdornment = (): Components["MuiInputAdornment"] => ({
    styleOverrides: {
        root: {
            height: "auto",
            alignSelf: "stretch",
            maxHeight: "none",
        },
        positionStart: {
            marginRight: 0,
        },
        positionEnd: {
            marginLeft: 0,
        },
    },
});
