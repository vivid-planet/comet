import { SwitchClassKey } from "@material-ui/core";
import { StyleRules } from "@material-ui/styles/withStyles";

import { bluePalette, greenPalette, neutrals } from "../colors";

export const getMuiSwitchOverrides = (): StyleRules<{}, SwitchClassKey> => ({
    root: {
        width: 54,
        height: 34,
        padding: 9,
        display: "flex",
    },
    checked: {},
    disabled: {},
    input: {},
    switchBase: {
        margin: 9,
        padding: 3,
        color: neutrals[200],
        "&$checked": {
            transform: "translateX(20px)",
            color: bluePalette.main,
            "& + $track": {
                opacity: 1,
                border: `1px solid ${neutrals[100]}`,
            },
        },
        "&$disabled": {
            color: neutrals[100],
            "& + $track": {
                opacity: 1,
                backgroundColor: neutrals[50],
                border: `1px solid ${neutrals[100]}`,
            },
        },
    },
    colorPrimary: {
        "&$switchBase$checked": {
            color: bluePalette.main,
        },
        "&$checked + $track": {
            backgroundColor: "#fff",
            borderColor: bluePalette.main,
        },
    },
    colorSecondary: {
        "&$switchBase$checked": {
            color: greenPalette.main,
        },
        "&$checked + $track": {
            backgroundColor: "#fff",
            borderColor: greenPalette.main,
        },
    },
    sizeSmall: {},
    thumb: {
        width: 10,
        height: 10,
        boxShadow: "none",
    },
    track: {
        border: `1px solid ${neutrals[100]}`,
        boxSizing: "border-box",
        borderRadius: 16 / 2,
        opacity: 1,
        transition: "none",
        backgroundColor: "#fff",
    },
});
