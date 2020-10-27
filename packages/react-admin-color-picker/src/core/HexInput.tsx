import * as React from "react";
import { ColorChangeHandler } from "react-color";
// tslint:disable-next-line: no-submodule-imports
import { EditableInput } from "react-color/lib/components/common";
import * as tinycolor from "tinycolor2";
import { IVPAdminColorPickerProps } from "./ColorPicker";

interface IComponentProps {
    value: string;
    onChange: (value?: string) => void;
    picker: boolean;
    palette: boolean;
}

interface IPickedColorProps {
    value: string;
    pickedColorClass: string;
}

const resetedInputStyles = {
    input: {
        border: "inherit",
        outline: "inherit",
        color: "inherit",
        backgroundColor: "inherit",
        font: "inherit",
        padding: "inherit",
        margin: "inherit",
        cursor: "inherit",
    },
};

const PickedColor: React.FC<IPickedColorProps> = ({ value, pickedColorClass }) => (
    <div className={pickedColorClass} style={{ background: value ? tinycolor(value).toHexString() : undefined }} />
);

const HexInput: React.FC<IComponentProps & IVPAdminColorPickerProps> = ({ value, classes, onChange, picker, palette }) => {
    return (
        <>
            <PickedColor value={value} pickedColorClass={classes.pickedColorIndicator} />
            {!palette || (palette && picker) ? (
                <EditableInput style={resetedInputStyles} value={value} onChange={(onChange as unknown) as ColorChangeHandler} />
            ) : (
                <div className={classes.readOnlyInput}>{value.toUpperCase()}</div>
            )}
        </>
    );
};

export default HexInput;
