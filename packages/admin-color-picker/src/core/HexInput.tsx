import * as React from "react";
import { EditableInput } from "react-color/lib/components/common";

import { ColorPickerProps } from "./ColorPicker";

interface IComponentProps {
    value: string;
    onChange: (value?: string) => void;
    picker: boolean;
    palette: boolean;
}

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
        "&::-ms-clear": {
            display: "none",
        },
    },
};

const HexInput: React.FC<IComponentProps & ColorPickerProps> = ({ value, classes, onChange, picker, palette }) => (
    <div className={classes.inputInner}>
        <div className={classes.inputInnerLeftContent}>
            {!palette || (palette && picker) ? (
                <EditableInput
                    style={resetInputStyles}
                    value={value}
                    onChange={(colorState) => {
                        onChange(colorState.hex);
                    }}
                />
            ) : (
                <div className={classes.readOnlyInput}>{value.toUpperCase()}</div>
            )}
        </div>
    </div>
);

export default HexInput;
