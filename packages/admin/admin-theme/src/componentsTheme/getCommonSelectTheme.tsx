import { ChevronDown } from "@comet/admin-icons";
import { Palette } from "@mui/material";

export const commonSelectDefaultProps = {
    IconComponent: ChevronDown,
};

export const commonSelectStyleOverrides = {
    minHeight: 38,
    paddingRight: 32,

    "&:focus": {
        backgroundColor: "transparent",
    },
};

export const getCommonIconStyleOverrides = (palette: Palette) => ({
    right: 10,
    color: palette.grey[900],
});
