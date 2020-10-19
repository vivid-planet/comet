import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

export type VPAdminColorPickerClassKeys =
    | "input"
    | "popover"
    | "pickedColorIndicator"
    | "saturationWrapper"
    | "saturationPointer"
    | "hueWrapper"
    | "hueSliderMarker"
    | "paletteWrapper"
    | "paletteItem";

const styles = (theme: Theme) =>
    createStyles({
        input: {},
        popper: {},
        pickedColorIndicator: {
            width: "20px",
            height: "20px",
            marginRight: "10px",
            borderRadius: `${theme.shape.borderRadius}`,
            border: `1px solid ${theme.palette.grey[300]}`,
            flexGrow: 0,
            flexShrink: 0,
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
            margin: "3px",
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
    });
export default styles;
