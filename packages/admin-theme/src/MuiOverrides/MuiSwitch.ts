import { SwitchClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiSwitchOverrides = (palette: Palette): OverridesStyleRules<SwitchClassKey> => ({
    root: {
        width: 54,
        height: 34,
        padding: 9,
        display: "flex",
    },
    edgeStart: {},
    edgeEnd: {},
    switchBase: {
        margin: 9,
        padding: 3,
        color: palette.grey[200],
        "&$checked": {
            transform: "translateX(20px)",
            color: palette.primary.main,
            "& + $track": {
                opacity: 1,
                border: `1px solid ${palette.grey[100]}`,
            },
        },
        "&$disabled": {
            color: palette.grey[100],
            "& + $track": {
                opacity: 1,
                backgroundColor: palette.grey[50],
                border: `1px solid ${palette.grey[100]}`,
            },
        },
    },
    colorPrimary: {
        "&$switchBase$checked": {
            color: palette.primary.main,
        },
        "&$checked + $track": {
            backgroundColor: "#fff",
            borderColor: palette.primary.main,
        },
    },
    colorSecondary: {
        "&$switchBase$checked": {
            color: palette.secondary.main,
        },
        "&$checked + $track": {
            backgroundColor: "#fff",
            borderColor: palette.secondary.main,
        },
    },
    sizeSmall: {},
    sizeMedium: {},
    checked: {},
    disabled: {},
    input: {},
    thumb: {
        width: 10,
        height: 10,
        boxShadow: "none",
    },
    track: {
        border: `1px solid ${palette.grey[100]}`,
        boxSizing: "border-box",
        borderRadius: 16 / 2,
        opacity: 1,
        transition: "none",
        backgroundColor: "#fff",
    },
});
