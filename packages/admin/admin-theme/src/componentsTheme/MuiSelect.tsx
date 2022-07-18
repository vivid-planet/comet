import { ChevronDown } from "@comet/admin-icons";
import { InputAdornment, InputBase } from "@mui/material";
import * as React from "react";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import { GetMuiComponentTheme } from "./getComponentsTheme";

type IconProps = {
    className?: string;
};

const Icon = ({ className }: IconProps) => (
    <InputAdornment position="end" className={className}>
        <ChevronDown />
    </InputAdornment>
);

export const getMuiSelect: GetMuiComponentTheme<"MuiSelect"> = (component, { palette, spacing }) => ({
    ...component,
    defaultProps: {
        IconComponent: Icon,
        input: <InputBase sx={{ paddingRight: spacing(2) }} />,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiSelect">(component?.styleOverrides, {
        select: {
            height: 38,
            paddingRight: 32,

            "&:focus": {
                backgroundColor: "transparent",
            },

            "&:after": {
                // Expand the clickable area to allow opening by clicking an input adornment, e.g., the arrow-down icon.
                content: '""',
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                left: 0,
            },
        },
        icon: {
            position: "relative",
            right: 0,
            order: 1,
            color: palette.grey[900],
        },
    }),
});
