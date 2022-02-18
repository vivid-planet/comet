import { SelectClassKey } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridesStyleRules } from "@mui/material/styles/overrides";

export const getMuiSelectOverrides = (palette: Palette): OverridesStyleRules<SelectClassKey> => ({
    select: {
        paddingRight: 32,
        "&:focus": {
            backgroundColor: "transparent",
        },
    },
    multiple: {},
    filled: {},
    outlined: {},
    standard: {},
    disabled: {},
    icon: {
        top: "calc(50% - 8px)",
        right: 12,
        fontSize: 12,
        color: palette.grey[900],
    },
    iconOpen: {},
    iconFilled: {},
    iconOutlined: {},
    iconStandard: {},
    nativeInput: {},
});
