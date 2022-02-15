import { AutocompleteClassKey } from "@mui/material";
import { OverridesStyleRules } from "@mui/material/styles/overrides";
import { Spacing } from "@mui/system";

export const getMuiAutocompleteOverrides = (spacing: Spacing): OverridesStyleRules<AutocompleteClassKey> => ({
    root: {},
    fullWidth: {},
    focused: {},
    tag: {},
    tagSizeSmall: {},
    tagSizeMedium: {},
    hasPopupIcon: {},
    hasClearIcon: {},
    inputRoot: {},
    input: {},
    inputFocused: {},
    endAdornment: {
        top: "auto",
        right: spacing(2),
    },
    clearIndicator: {},
    popupIndicator: {},
    popupIndicatorOpen: {},
    popper: {},
    popperDisablePortal: {},
    paper: {},
    listbox: {},
    loading: {},
    noOptions: {},
    option: {},
    groupLabel: {},
    groupUl: {},
});
