import { ClickAwayListener, InputBase, Paper, Popper, withStyles } from "@material-ui/core";
import * as React from "react";
import { CustomPicker } from "react-color";
import { FieldRenderProps } from "react-final-form";
import * as tinycolor from "tinycolor2";
import { colorToHex } from "../utils/colorSpaces";
import styles from "./ColorPicker.styles";
import HexInput from "./HexInput";
import Palette from "./Palette";
import Picker from "./Picker";

export interface IVPAdminColorPickerProps {
    classes: {
        input: string;
        inputInner: string;
        clearButton: string;
        clearIcon: string;
        popper: string;
        pickedColorWrapper: string;
        noColorStroke: string;
        pickedColorIndicator: string;
        saturationWrapper: string;
        saturationPointer: string;
        hueWrapper: string;
        hueSliderMarker: string;
        paletteWrapper: string;
        paletteItem: string;
        readOnlyInput: string;
    };
}

interface IComponentProps extends FieldRenderProps<string, HTMLInputElement> {
    colorPalette?: string[];
    showPicker?: boolean;
    pickerWidth?: number;
}

const ColorPicker: React.FC<IComponentProps & IVPAdminColorPickerProps> = ({
    colorPalette,
    showPicker,
    pickerWidth,
    classes,
    input: { value, onChange },
}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLInputElement | null>(null);
    const [inputWidth, setInputWidth] = React.useState<number>(pickerWidth ? pickerWidth : 300);
    const inputRef = React.useRef<HTMLInputElement>();

    const setPopperWidth = () => {
        if (!pickerWidth && inputRef.current && inputRef.current.offsetWidth) {
            setInputWidth(inputRef.current.offsetWidth);
        }
    };

    const handleAwayClick = () => {
        setAnchorEl(null);
    };

    const handleFieldClick = (event: React.MouseEvent) => {
        const clickedElement = event.target as HTMLElement;
        if (clickedElement.tagName === "INPUT" || clickedElement.tagName === "DIV") {
            setPopperWidth();
            setAnchorEl(event.currentTarget as HTMLInputElement);
        }
    };

    React.useEffect(() => {
        onChange(colorToHex(value)); // convert initial color to hex
    }, []);

    const isOpen = Boolean(anchorEl);

    return (
        <ClickAwayListener onClickAway={handleAwayClick}>
            <div>
                <InputBase
                    ref={inputRef}
                    inputComponent={HexInput as React.ComponentType}
                    value={value ? tinycolor(value).toHexString() : ""}
                    inputProps={{
                        value: value ? tinycolor(value).toHexString() : "",
                        classes,
                        picker: !!showPicker,
                        palette: !!colorPalette?.length,
                        pickerWidth,
                    }}
                    onChange={newColor => onChange(colorToHex((newColor as unknown) as tinycolor.ColorInputWithoutInstance))}
                    className={classes.input}
                    onClick={handleFieldClick}
                />
                <Popper open={isOpen} anchorEl={anchorEl} placement={"bottom"} style={{ width: `${inputWidth}px` }} className={classes.popper}>
                    <Paper>
                        {showPicker && <Picker classes={classes} color={value} onChange={onChange} />}
                        {colorPalette?.length && <Palette classes={classes} colors={colorPalette} onChange={onChange} />}
                    </Paper>
                </Popper>
            </div>
        </ClickAwayListener>
    );
};

export default withStyles(styles, { name: "VPAdminColorPicker", withTheme: true })(CustomPicker(ColorPicker));
