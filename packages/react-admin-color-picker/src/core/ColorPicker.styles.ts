import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import { getDefaultVPAdminInputStyles } from "@vivid-planet/react-admin";

export type VPAdminColorPickerClassKeys =
    | "input"
    | "inputInner"
    | "inputInnerLeftContent"
    | "clearButton"
    | "clearIcon"
    | "popover"
    | "pickedColorWrapper"
    | "noColorStroke"
    | "pickedColorIndicator"
    | "saturationWrapper"
    | "saturationPointer"
    | "hueWrapper"
    | "hueSliderMarker"
    | "paletteWrapper"
    | "paletteItem"
    | "readOnlyInput";

const styles = (theme: Theme) => {
    const inputDefaultStyles = getDefaultVPAdminInputStyles(theme);

    return createStyles({
        input: {
            ...inputDefaultStyles,
            display: "flex",
            paddingRight: 0,
        },
        inputInner: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
        },
        inputInnerLeftContent: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        clearButton: {
            height: inputDefaultStyles.height,
            width: inputDefaultStyles.height,
        },
        clearIcon: {},
        popper: {},
        pickedColorWrapper: {
            position: "relative",
            marginRight: "10px",
            flexGrow: 0,
            flexShrink: 0,
        },
        noColorStroke: {
            position: "absolute",
            width: "2px",
            height: "100%",
            background: "red",
            transform: "rotate(45deg)",
            right: "10px",
        },
        pickedColorIndicator: {
            width: "20px",
            height: "20px",
            borderRadius: `${theme.shape.borderRadius}`,
            border: `1px solid ${theme.palette.grey[300]}`,
        },
        saturationWrapper: {
            position: "relative",
            width: "100%",
            paddingBottom: "75%",
            overflow: "hidden",
            cursor: "pointer",
        },
        saturationPointer: {
            width: "20px",
            height: "20px",
            background: "#f8f8f8",
            borderRadius: "50%",
            boxShadow: "0 1px 4px 0 rgba(0, 0, 0, 0.37)",
            transform: "translate(-10px, -10px)",
            cursor: "pointer",
        },
        hueWrapper: {
            position: "relative",
            height: "20px",
            cursor: "pointer",
        },
        hueSliderMarker: {
            width: "6px",
            height: "18px",
            marginTop: "1px",
            background: "white",
            borderRadius: "1px",
            boxShadow: "0 0 2px rgba(0, 0, 0, 0.6)",
            transform: "translateX(-3px)",
            cursor: "pointer",
        },
        paletteWrapper: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "10px 10px 15px 15px",
        },
        paletteItem: {
            width: "20px",
            height: "20px",
            margin: "5px 5px 0 0",
            borderRadius: `${theme.shape.borderRadius}`,
            boxShadow: "0 0 2px rgba(0, 0, 0, 0.6)",
            cursor: "pointer",
        },
        readOnlyInput: {
            cursor: "pointer",
            width: "100%",
        },
    });
};
export default styles;
