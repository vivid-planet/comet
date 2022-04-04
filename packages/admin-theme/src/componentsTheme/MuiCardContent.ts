import { Components } from "@mui/material/styles/components";
import { Spacing } from "@mui/system";

export const getMuiCardContent = (spacing: Spacing): Components["MuiCardContent"] => ({
    styleOverrides: {
        root: {
            padding: spacing(4),
            "&:last-child": {
                paddingBottom: spacing(4),
            },
        },
    },
});
