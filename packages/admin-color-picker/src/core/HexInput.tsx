import * as React from "react";
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
    },
};

const PickedColor: React.FC<IPickedColorProps & IVPAdminColorPickerProps> = ({ value, classes }) => (
    <div className={classes.pickedColorWrapper}>
        {!value && <div className={classes.noColorStroke} />}
        <div className={classes.pickedColorIndicator} style={{ background: value ? tinycolor(value).toHexString() : undefined }} />
    </div>
);

const HexInput: React.FC<IComponentProps & IVPAdminColorPickerProps> = ({ value, classes, onChange, picker, palette }) => (
    <>
        <div className={classes.inputInner}>
            <div className={classes.inputInnerLeftContent}>
                <PickedColor value={value} classes={classes} />
                {!palette || (palette && picker) ? (
                    <EditableInput style={resetInputStyles} value={value} onChange={onChange} />
                ) : (
                    <div className={classes.readOnlyInput}>{value.toUpperCase()}</div>
                )}
            </div>
        </div>
    </>
);

export default HexInput;
