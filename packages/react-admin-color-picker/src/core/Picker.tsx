import * as React from "react";
import { ColorState } from "react-color";
// tslint:disable-next-line: no-submodule-imports
import { Hue, Saturation } from "react-color/lib/components/common";
import { ColorInputWithoutInstance } from "tinycolor2";
import { IVPAdminColorPickerProps } from "./ColorPicker";

interface IPickerProps {
    color: ColorState;
    onChange: (colorValue: ColorState | ColorInputWithoutInstance) => void;
}

const Picker: React.FC<IPickerProps & IVPAdminColorPickerProps> = ({ color, onChange, classes }) => (
    <>
        <div className={classes.saturationWrapper}>
            <Saturation hsl={color.hsl} hsv={color.hsv} pointer={() => <div className={classes.saturationPointer} />} onChange={onChange} />
        </div>
        <div className={classes.hueWrapper}>
            <Hue hsl={color.hsl} pointer={() => <div className={classes.hueSliderMarker} />} direction={"horizontal"} onChange={onChange} />
        </div>
    </>
);

export default Picker;
