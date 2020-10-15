import { ColorState } from "react-color";
import * as tinycolor from "tinycolor2";

export function getColorSpaces(colorValue: tinycolor.ColorInputWithoutInstance): ColorState {
    const color = tinycolor(colorValue);

    return {
        hex: color.toHex(),
        hsl: color.toHsl(),
        hsv: color.toHsv(),
        rgb: color.toRgb(),
        source: color.getFormat(),
        oldHue: 0,
    };
}
