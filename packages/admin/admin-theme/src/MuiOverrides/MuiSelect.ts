import { SelectClassKey } from "@material-ui/core";
import { Palette } from "@material-ui/core/styles/createPalette";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiSelectOverrides = (palette: Palette): StyleRules<{}, SelectClassKey> => ({
    root: {},
    select: {
        "&$select": {
            paddingRight: 32,
        },
        "&:focus": {
            backgroundColor: "transparent",
        },
    },
    filled: {},
    outlined: {},
    selectMenu: {},
    disabled: {},
    icon: {
        top: "calc(50% - 6px)",
        right: 12,
        fontSize: 12,
        color: palette.grey[900],
    },
    iconOpen: {},
    iconFilled: {},
    iconOutlined: {},
});
