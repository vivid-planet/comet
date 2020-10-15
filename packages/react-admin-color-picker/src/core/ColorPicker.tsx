import { withStyles } from "@material-ui/core";
import * as React from "react";
import { ColorState, CustomPicker } from "react-color";
// tslint:disable-next-line: no-submodule-imports
import { EditableInput } from "react-color/lib/components/common";
import * as tinycolor from "tinycolor2";
import { getColorSpaces } from "../utils/colorSpaces";
import styles from "./ColorPicker.styles";
import Palette from "./Palette";
import Picker from "./Picker";

export interface IVPAdminColorPickerProps {
    classes: {
        wrapper: string;
        field: string;
        pickedColorIndicator: string;
        pickerWrapper: string;
        saturationWrapper: string;
        saturationPointer: string;
        hueWrapper: string;
        hueSliderMarker: string;
        paletteWrapper: string;
        colorTile: string;
    };
}

interface IComponentProps {
    initialColor?: tinycolor.ColorInputWithoutInstance;
    colorPalette?: tinycolor.ColorInputWithoutInstance[];
    showPicker?: boolean;
}

const ColorPicker: React.FC<IComponentProps & IVPAdminColorPickerProps> = ({ initialColor = "darkcyan", showPicker, colorPalette, classes }) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const [activeColor, setActiveColor] = React.useState<ColorState>();
    const [isColorPickerOpen, setIsColorPickerOpen] = React.useState(false);

    const handleClickOutside = (event: MouseEvent) => {
        if (!wrapperRef.current?.contains(event.target as Node)) setIsColorPickerOpen(false);
    };

    const handleFieldClick = () => {
        setIsColorPickerOpen(!isColorPickerOpen);
    };

    // workaround because the built-in "onChange"-function from react-color expects color
    // to be of type "ColorState", in reality however it is of type "ColorInputWithoutInstance"
    const handleColorChange = (newColor: ColorState | tinycolor.ColorInputWithoutInstance) => {
        if (typeof newColor === "string" || !("hex" in newColor)) {
            setActiveColor(getColorSpaces(newColor));
        }
    };

    React.useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    React.useEffect(() => {
        setActiveColor(getColorSpaces(initialColor));
    }, [initialColor]);

    return (
        <>
            {activeColor && (
                <div className={classes.wrapper} ref={wrapperRef}>
                    <div className={classes.field} onClick={handleFieldClick}>
                        <div className={classes.pickedColorIndicator} style={{ background: tinycolor(activeColor.hex).toHexString() }} />
                        <EditableInput
                            style={{ input: { border: "none", outline: "none" } }}
                            value={tinycolor(activeColor.hex).toHexString()}
                            onChange={handleColorChange}
                        />
                    </div>
                    {isColorPickerOpen && (
                        <div className={classes.pickerWrapper}>
                            {showPicker && <Picker classes={classes} color={activeColor} onChange={handleColorChange} />}
                            {colorPalette?.length && <Palette classes={classes} colors={colorPalette} onChange={handleColorChange} />}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default withStyles(styles, { name: "VPAdminColorPicker", withTheme: true })(CustomPicker(ColorPicker));
