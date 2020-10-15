import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

export type VPAdminColorPickerClassKeys =
    | "wrapper"
    | "field"
    | "pickedColorIndicator"
    | "pickerWrapper"
    | "saturationWrapper"
    | "saturationPointer"
    | "hueWrapper"
    | "hueSliderMarker"
    | "paletteWrapper"
    | "colorTile";

const styles = (theme: Theme) =>
    createStyles({
        wrapper: {
            position: "relative",
            width: "100%",
            height: "100%",
        },
        field: {
            position: "relative",
            height: "32px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "0 10px",
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: "2px",
            cursor: "pointer",
        },
        pickedColorIndicator: {
            width: "20px",
            height: "20px",
            marginRight: "10px",
            borderRadius: "5px",
        },
        pickerWrapper: {
            position: "absolute",
            top: "32px",
            left: 0,
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 0,
            boxSizing: "border-box",
            border: `1px solid ${theme.palette.grey[300]}`,
            borderRadius: "2px",
            zIndex: 1,
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
            position: "relative",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: "10px",
            background: "white",
            boxSizing: "border-box",
            borderRadius: "2px",
            zIndex: 1,
        },
        colorTile: {
            width: "20px",
            height: "20px",
            marginRight: "5px",
            borderRadius: "5px",
            boxShadow: "0 0 2px rgba(0, 0, 0, 0.6)",
            cursor: "pointer",
            zIndex: 2,
        }
    });
export default styles;
