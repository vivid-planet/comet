import * as React from "react";
import EditableInput, { EditableInputProps } from "react-color/lib/components/common/EditableInput";

import { ColorPickerProps } from "./ColorPicker";

const resetInputStyles = {
    input: {
        border: "inherit",
        outline: "inherit",
        color: "inherit",
        backgroundColor: "inherit",
        font: "inherit",
        padding: "inherit",
        margin: "inherit",
        cursor: "inherit",
        width: "100%",
        "&::MsClear": {
            display: "none",
        },
    },
};

interface Props extends ColorPickerProps {
    value: string;
    picker: boolean;
    palette: boolean;
    onChange: EditableInputProps["onChange"];
}

export function HexInput({ value, classes, onChange, picker, palette }: Props) {
    return (
        <div className={classes.inputInner}>
            <div className={classes.inputInnerLeftContent}>
                {!palette || (palette && picker) ? (
                    <EditableInput style={resetInputStyles} value={value} onChange={onChange} />
                ) : (
                    <div className={classes.readOnlyInput}>{value.toUpperCase()}</div>
                )}
            </div>
        </div>
    );
}
