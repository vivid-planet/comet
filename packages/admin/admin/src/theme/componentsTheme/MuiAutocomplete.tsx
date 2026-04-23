import { Clear } from "@comet/admin-icons";
import { autocompleteClasses, inputAdornmentClasses } from "@mui/material";

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
            // Position the custom end-adornment (loading / clear / error / popup-icon wrapper) absolutely
            // so it stays pinned to the right of the input even when chips wrap to multiple rows in
            // multi-select. Horizontal space is reserved via `inputRoot` padding-right (see `hasPopupIcon`).
            [`.${autocompleteClasses.inputRoot} > .${inputAdornmentClasses.positionEnd}`]: {
                position: "absolute",
                top: 0,
                bottom: 0,
                right: spacing(2),
                height: "auto",
                maxHeight: "none",
                margin: 0,
            },
        },
        endAdornment: {
            // Render inline inside the outer InputAdornment (instead of absolutely-positioned on its own)
            // so the popup-icon sits alongside clear/loading/error.
            position: "static",
            transform: "none",
            display: "flex",
        },
        hasPopupIcon: {
            [`&.${autocompleteClasses.root} .${autocompleteClasses.inputRoot}`]: {
                // Reserve space for the absolutely-positioned end-adornment (popup icon + right offset,
                // plus the clear button when a value is selected) so chips can't overlap it.
                paddingRight: 52,
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
