import * as React from "react";
import * as tinycolor from "tinycolor2";
import { IVPAdminColorPickerProps } from "./ColorPicker";

interface IProps {
    colors: tinycolor.ColorInputWithoutInstance[];
    onChange: (color: tinycolor.ColorInputWithoutInstance) => void;
}

export const Palette: React.FC<IProps & IVPAdminColorPickerProps> = ({ colors, onChange, classes }) => (
    <div className={classes.paletteWrapper}>
        {colors.map((color, index) => (
            <div  key={`${index}_${color}`} className={classes.colorTile} style={{ background: tinycolor(color).toHexString()}} onClick={() => onChange(color)} />
        ))}
    </div>
);

export default Palette;
