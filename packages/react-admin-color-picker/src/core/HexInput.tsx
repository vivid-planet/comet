import { ButtonBase } from "@material-ui/core";
import { Clear as ClearIcon } from "@material-ui/icons";
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
                    <EditableInput style={resetedInputStyles} value={value} onChange={(onChange as unknown) as ColorChangeHandler} />
                ) : (
                    <div className={classes.readOnlyInput}>{value.toUpperCase()}</div>
                )}
            </div>
        </div>
        <ButtonBase classes={{ root: classes.clearButton }} onClick={() => onChange("")}>
            <ClearIcon className={classes.clearIcon} fontSize="small" />
        </ButtonBase>
    </>
);

export default HexInput;
