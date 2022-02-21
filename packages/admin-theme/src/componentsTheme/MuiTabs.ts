import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";
import { Spacing } from "@mui/system";

export const getMuiTabs = (palette: Palette, spacing: Spacing): Components["MuiTabs"] => ({
    styleOverrides: {
        root: {
            position: "relative",
            marginBottom: spacing(4),

            "&:after": {
                content: '""',
                position: "absolute",
                right: 0,
                bottom: 0,
                left: 0,
                height: 1,
                backgroundColor: palette.grey[100],
            },
        },
        scroller: {
            zIndex: 1,
        },
        indicator: {
            backgroundColor: palette.primary.main,
            height: 2,
        },
    },
});
