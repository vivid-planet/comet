import { InputBaseClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";
import { Spacing } from "@mui/system";

export const getMuiInputBaseOverrides = (palette: Palette, spacing: Spacing): OverridesStyleRules<InputBaseClassKey> => ({
    root: {
        border: `1px solid ${palette.grey[100]}`,
        borderRadius: 2,
        backgroundColor: "#fff",
        "& [class*='MuiSvgIcon-root']": {
            pointerEvents: "none",
        },
        "& [class*='CometAdminClearInputButton-root']": {
            marginRight: -spacing(2),
            marginLeft: -spacing(2),
            "& [class*='MuiSvgIcon-root']": {
                pointerEvents: "auto",
            },
        },
        "&$focused": {
            borderColor: palette.primary.main,
        },
    },
    formControl: {},
    focused: {},
    disabled: {},
    adornedStart: {
        paddingLeft: spacing(2),
    },
    adornedEnd: {
        paddingRight: spacing(2),
    },

    error: {},
    sizeSmall: {},
    multiline: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    colorSecondary: {},
    fullWidth: {},
    hiddenLabel: {},
    input: {
        height: "auto",
        boxSizing: "border-box",
        // TODO: fix spacing
        // padding: spacing(2) - 1, // 1px less for border, set in root
        lineHeight: "20px",
        "&::-ms-clear": {
            display: "none",
        },
    },
    inputSizeSmall: {},
    inputMultiline: {
        // TODO: fix spacing
        // padding: spacing(2) - 1, // 1px less for border, set in root
    },
    inputTypeSearch: {},
    inputAdornedStart: {
        paddingLeft: spacing(2),
    },
    inputAdornedEnd: {
        paddingRight: spacing(2),
    },
    inputHiddenLabel: {},
});
