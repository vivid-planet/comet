import { CometAdminSelectClassKeys } from "@comet/admin-react-select";
import { StyleRules } from "@material-ui/styles/withStyles";

export const cometAdminSelectOverrides = (): StyleRules<{}, CometAdminSelectClassKeys> => ({
    input: {},
    valueContainer: {},
    chip: {},
    chipFocused: {},
    noOptionsMessage: {},
    singleValue: {},
    placeholder: {},
    paper: {},
    indicatorsContainer: {},
    indicatorSeparator: {},
    clearIndicator: {},
    indicator: {},
    dropdownIndicator: {},
});
