import { buttonClasses, iconButtonClasses } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { Components } from "@mui/material/styles/components";
import { Typography } from "@mui/material/styles/createTypography";

export const getMuiTableCell = (palette: Palette, typography: Typography): Components["MuiTableCell"] => ({
    styleOverrides: {
        root: {
            position: "relative",
            borderBottomColor: palette.grey[100],
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 20,
            paddingRight: 20,

            [`& > .${buttonClasses.root}, & > ${iconButtonClasses.root}`]: {
                marginTop: -12,
                marginBottom: -10,
            },
        },
        head: {
            borderTop: `1px solid ${palette.grey[100]}`,
            fontSize: 14,
            lineHeight: "20px",
            fontWeight: typography.fontWeightMedium,

            "&:not(:first-child):not(:empty):before": {
                content: "''",
                position: "absolute",
                top: 15,
                left: 8,
                bottom: 15,
                backgroundColor: palette.grey[100],
                width: 2,
            },
        },
        body: {
            fontSize: 16,
            lineHeight: "20px",
        },
    },
});
