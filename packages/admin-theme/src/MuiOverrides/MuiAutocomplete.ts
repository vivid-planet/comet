import { Spacing } from "@material-ui/core/styles/createSpacing";
import { AutocompleteClassKey } from "@material-ui/lab";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getMuiAutocompleteOverrides = (spacing: Spacing): StyleRules<{}, AutocompleteClassKey> => ({
    root: {},
    focused: {},
    tag: {},
    tagSizeSmall: {},
    inputRoot: {},
    input: {},
    inputFocused: {},
    endAdornment: {
        top: "auto",
        right: spacing(2),
    },
    clearIndicator: {},
    clearIndicatorDirty: {},
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
