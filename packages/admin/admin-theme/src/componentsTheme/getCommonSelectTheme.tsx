import { ChevronDown } from "@comet/admin-icons";
import { inputAdornmentClasses, inputBaseClasses, Palette } from "@mui/material";

export const commonSelectDefaultProps = {
    IconComponent: ChevronDown,
};

export const commonSelectStyleOverrides = {
    minHeight: 38,
    paddingRight: 32,

    "&:focus": {
        backgroundColor: "transparent",
    },

    [`&.${inputBaseClasses.inputAdornedEnd}`]: {
        paddingRight: 42,
    },

    [`& ~ .${inputAdornmentClasses.positionEnd}`]: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 26,
    },
};

export const getCommonIconStyleOverrides = (palette: Palette) => ({
    right: 10,
    color: palette.grey[900],
});
