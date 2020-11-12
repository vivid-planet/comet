import { Paper } from "@material-ui/core";
import * as React from "react";
import * as tinycolor from "tinycolor2";
import { IVPAdminColorPickerProps } from "./ColorPicker";

interface IProps {
    colors: string[];
    onChange: (colorValue: string) => void;
}

export const Palette: React.FC<IProps & IVPAdminColorPickerProps> = ({ colors, onChange, classes }) => (
    <Paper className={classes.paletteWrapper}>
        {colors.map((color, index) => (
            <div
                key={`${index}_${color}`}
                className={classes.paletteItem}
                style={{ background: tinycolor(color).toHexString() }}
                onClick={() => onChange(color)}
            />
        ))}
    </Paper>
);

export default Palette;
