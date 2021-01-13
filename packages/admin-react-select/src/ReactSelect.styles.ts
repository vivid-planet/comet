import { Theme } from "@material-ui/core";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import zIndex from "@material-ui/core/styles/zIndex";
import { createStyles } from "@material-ui/styles";

// TODO: import from "@comet/admin" after publish.
const getDefaultVPAdminInputStyles = (theme: Theme) => {
    return {
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: "2px",
        padding: "0 10px",
        height: "32px",
    };
};

export type VPAdminSelectClassKeys =
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
    | "dropdownIndicator";

const styles = (theme: Theme) =>
    createStyles({
        input: {
            ...getDefaultVPAdminInputStyles(theme),
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
        paper: {
            position: "absolute",
            zIndex: zIndex.modal,
            left: 0,
            right: 0,
        },
        indicatorsContainer: {
            display: "flex",
        },
        indicatorSeparator: {
            width: 1,
            flexGrow: 1,
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
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
    });

export default styles;
