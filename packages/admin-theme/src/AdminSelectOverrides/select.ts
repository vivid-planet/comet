import { CometAdminSelectClassKeys } from "@comet/admin-react-select";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getSelectOverrides = (): StyleRules<{}, CometAdminSelectClassKeys> => ({
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
    option: {},
    optionSelected: {},
    optionFocused: {},
});
