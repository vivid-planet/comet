import { Clear } from "@comet/admin-icons";
import { autocompleteClasses } from "@mui/material";

import { mergeOverrideStyles } from "../utils/mergeOverrideStyles";
import type { GetMuiComponentTheme } from "./getComponentsTheme";

export const getMuiAutocomplete: GetMuiComponentTheme<"MuiAutocomplete"> = (component, { spacing }) => ({
    ...component,
    defaultProps: {
        clearIcon: <Clear color="action" />,
        ...component?.defaultProps,
    },
    styleOverrides: mergeOverrideStyles<"MuiAutocomplete">(component?.styleOverrides, {
        loading: {
            color: "inherit",
        },
        root: {
            // In multi-select, chips are wrapped by `FinalFormAutocomplete` in a dedicated
            // `CometAdminAutocomplete-chipsWrap` container. The outer `inputRoot` uses `flex-wrap: wrap`,
            // so the input stays on the same row as the chips when there is enough horizontal space and
            // wraps to the next row otherwise. The end-adornment remains inline after the input and grows
            // naturally to fit its content (loading / clear / error / popup-icon).
            [`& .${autocompleteClasses.inputRoot}`]: {
                flexWrap: "wrap",
                alignItems: "center",
            },
            "& .CometAdminAutocomplete-chipsWrap": {
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: spacing(0.5),
                flex: "1 1 auto",
                minWidth: 0,
            },
            // Give the inner `<input>` a comfortable minimum width so it wraps to a new row when the chips
            // container fills most of the row, instead of getting squeezed into a thin sliver.
            [`& .CometAdminAutocomplete-chipsWrap ~ .${autocompleteClasses.input}`]: {
                flex: "1 0 100px",
                minWidth: 100,
            },
        },
        endAdornment: {
            top: 0,
            bottom: 0,
            right: spacing(2),
            display: "flex",
            transform: "none",
        },
        hasPopupIcon: {
            [`&.${autocompleteClasses.root} .${autocompleteClasses.inputRoot}`]: {
                paddingRight: 26,
            },
        },
        popupIndicator: {
            "&:hover": {
                backgroundColor: "transparent",
            },
            "& .MuiSvgIcon-root": {
                fontSize: "12px",
            },
        },
    }),
});
