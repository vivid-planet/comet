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
            // Keep the outer InputBase row on a single no-wrap flex line so the end-adornment can never
            // be pushed below chips. In multi-select, chips wrap inside their own inner `CometAdminAutocomplete-chipsWrap`
            // container (rendered by `FinalFormAutocomplete`). The end-adornment stays inline and grows
            // naturally as items are added (loading / clear / error / popup-icon).
            [`& .${autocompleteClasses.inputRoot}`]: {
                flexWrap: "nowrap",
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
