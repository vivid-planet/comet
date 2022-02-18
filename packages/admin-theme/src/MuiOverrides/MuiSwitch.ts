import { switchClasses, SwitchClassKey } from "@mui/material";
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

        [`&.${switchClasses.checked}`]: {
            transform: "translateX(20px)",
            color: palette.primary.main,

            [`& + .${switchClasses.track}`]: {
                opacity: 1,
                border: `1px solid ${palette.grey[100]}`,
            },
        },
        [`&.${switchClasses.disabled}`]: {
            color: palette.grey[100],

            [`& + .${switchClasses.track}`]: {
                opacity: 1,
                backgroundColor: palette.grey[50],
                border: `1px solid ${palette.grey[100]}`,
            },
        },
    },
    colorPrimary: {
        [`&.${switchClasses.switchBase}.${switchClasses.checked}`]: {
            color: palette.primary.main,
        },
        [`&.${switchClasses.checked} + .${switchClasses.track}`]: {
            backgroundColor: "#fff",
            borderColor: palette.primary.main,
        },
    },
    colorSecondary: {
        [`&.${switchClasses.switchBase}.${switchClasses.checked}`]: {
            color: palette.secondary.main,
        },
        [`&.${switchClasses.checked} + .${switchClasses.track}`]: {
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
