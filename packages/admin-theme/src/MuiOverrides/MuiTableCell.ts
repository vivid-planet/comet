import { TableCellClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { Typography } from "@material-ui/core/styles/createTypography";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiTableCellOverrides = (palette: Palette, typography: Typography): StyleRules<{}, TableCellClassKey> => ({
    root: {
        borderBottomColor: palette.grey[100],
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        "& > [class*='MuiButton-root'], & > [class*='MuiIconButton-root']": {
            marginTop: -12,
            marginBottom: -10,
        },
    },
    head: {
        position: "relative",
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
    footer: {},
    alignLeft: {},
    alignCenter: {},
    alignRight: {},
    alignJustify: {},
    sizeSmall: {},
    paddingCheckbox: {},
    paddingNone: {},
    stickyHeader: {},
});
