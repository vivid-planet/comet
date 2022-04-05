import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { ColorPickerProps } from "./ColorPicker";

export type ColorPickerClassKey =
    | "root"
    | "fullWidth"
    | "input"
    | "inputInner"
    | "inputInnerLeftContent"
    | "popper"
    | "popperPaper"
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

export const styles = (theme: Theme) => {
    return createStyles<ColorPickerClassKey, ColorPickerProps>({
        root: {
            width: 160,
        },
        fullWidth: {
            width: "100%",
        },
        input: {
            width: "100%",
        },
        inputInner: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            lineHeight: "20px",
            padding: 9,
        },
        inputInnerLeftContent: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
        },
        popper: {
            zIndex: theme.zIndex.modal,
        },
        popperPaper: {
            width: 300,
            overflow: "hidden",
        },
        pickedColorWrapper: {
            position: "relative",
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
            borderRadius: theme.shape.borderRadius,
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
            borderRadius: theme.shape.borderRadius,
            boxShadow: "0 0 2px rgba(0, 0, 0, 0.6)",
            cursor: "pointer",
        },
        readOnlyInput: {
            cursor: "pointer",
            width: "100%",
        },
    });
};
