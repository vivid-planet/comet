import { Theme } from "@material-ui/core";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import { createStyles } from "@material-ui/styles";

export type SelectClassKey =
    | "input"
    | "valueContainer"
    | "chip"
    | "chipFocused"
    | "noOptionsMessage"
    | "singleValue"
    | "placeholder"
    | "paper"
    | "indicatorsContainer"
    | "indicatorSeparator"
    | "clearIndicator"
    | "indicator"
    | "dropdownIndicator"
    | "option"
    | "optionSelected"
    | "optionFocused";

const styles = (theme: Theme) =>
    createStyles<SelectClassKey, any>({
        input: {
            display: "flex",
            paddingRight: 0,
        },
        valueContainer: {
            display: "flex",
            flexWrap: "nowrap",
            flex: 1,
            alignItems: "center",
            overflow: "hidden",
        },
        chip: {
            margin: `${theme.spacing(0.5)}px ${theme.spacing(0.25)}px`,
        },
        chipFocused: {
            backgroundColor: emphasize(theme.palette.type === "light" ? theme.palette.grey[300] : theme.palette.grey[700], 0.08),
        },
        noOptionsMessage: {
            padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
            color: theme.palette.text.secondary,
        },
        singleValue: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        placeholder: {
            color: theme.palette.text.disabled,
        },
        paper: {},
        indicatorsContainer: {
            display: "flex",
        },
        indicatorSeparator: {
            width: 1,
            flexGrow: 1,
            backgroundColor: theme.palette.divider,
        },
        indicator: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.grey[500],
            width: 32,
            cursor: "pointer",
        },
        clearIndicator: {
            fontSize: 18,
        },
        dropdownIndicator: {
            fontSize: 20,
        },
        option: {},
        optionSelected: {
            fontWeight: theme.typography.fontWeightMedium,
        },
        optionFocused: {
            backgroundColor: theme.palette.grey[50],
        },
    });

export default styles;
