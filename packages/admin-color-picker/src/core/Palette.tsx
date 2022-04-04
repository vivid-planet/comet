import { Paper } from "@mui/material";
import { WithStyles } from "@mui/styles";
import * as React from "react";
import tinycolor from "tinycolor2";

import { styles } from "./ColorPicker.styles";

interface PaletteProps {
    colors: string[];
    onChange: (colorValue: string) => void;
}

export const Palette: React.FC<Pick<WithStyles<typeof styles>, "classes"> & PaletteProps> = ({ colors, onChange, classes }) => (
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
