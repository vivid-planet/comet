import { HSLColor, HSVColor } from "react-color";
import * as tinycolor from "tinycolor2";

export function colorToHex(colorValue: string | tinycolor.ColorInputWithoutInstance | undefined): string {
    if (typeof colorValue === "string" && colorValue.length === 0) return "";

    const color = tinycolor(colorValue);
    return color.toHex();
}

export function stringToHSL(colorValue: string): HSLColor {
    const color = tinycolor(colorValue);
    return color.toHsl();
}

export function stringToHSV(colorValue: string): HSVColor {
    const color = tinycolor(colorValue);
    return color.toHsv();
}
