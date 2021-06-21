import { ClearInputButton } from "@comet/admin";
import { ClickAwayListener, InputBase, InputBaseProps, Paper, Popper, WithStyles, withStyles } from "@material-ui/core";
import * as React from "react";
import { CustomPicker } from "react-color";
import { FieldRenderProps } from "react-final-form";
import tinycolor from "tinycolor2";

import { colorToHex } from "../utils/colorSpaces";
import styles from "./ColorPicker.styles";
import { HexInput } from "./HexInput";
import Palette from "./Palette";
import PickedColor from "./PickedColor";
import Picker from "./Picker";

export interface ColorPickerThemeProps {
    colorPalette?: string[];
    showPicker?: boolean;
    showClearButton?: boolean;
    fullWidth?: boolean;
    startAdornment?: InputBaseProps["startAdornment"];
    endAdornment?: InputBaseProps["endAdornment"];
}

export type ColorPickerProps = WithStyles<typeof styles> & ColorPickerThemeProps & FieldRenderProps<string, HTMLInputElement>;

const ColorPicker: React.FC<ColorPickerProps> = ({
    colorPalette,
    showPicker,
    fullWidth,
    showClearButton,
    startAdornment,
    endAdornment,
    classes,
    input: { value, onChange },
}) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLInputElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement>();

    const handleAwayClick = () => {
        setAnchorEl(null);
    };

    const handleFieldClick = (event: React.MouseEvent) => {
        const clickedElement = event.target as HTMLElement;
        if (clickedElement.tagName === "INPUT" || clickedElement.tagName === "DIV") {
            setAnchorEl(event.currentTarget as HTMLInputElement);
        }
    };

    React.useEffect(() => {
        onChange(colorToHex(value)); // convert initial color to hex
    }, [onChange, value]);

    const isOpen = Boolean(anchorEl);

    const rootClasses: string[] = [classes.root];
    if (fullWidth) rootClasses.push(classes.fullWidth);

    return (
        <ClickAwayListener onClickAway={handleAwayClick}>
            <div className={rootClasses.join(" ")}>
                <InputBase
                    startAdornment={startAdornment ? startAdornment : <PickedColor value={value} classes={classes} />}
                    endAdornment={
                        endAdornment ? (
                            endAdornment
                        ) : showClearButton ? (
                            <ClearInputButton onClick={() => onChange("")} disabled={!value} />
                        ) : undefined
                    }
                    ref={inputRef}
                    inputComponent={HexInput as React.ComponentType}
                    value={value ? tinycolor(value).toHexString() : ""}
                    inputProps={{
                        value: value ? tinycolor(value).toHexString() : "",
                        classes,
                        picker: !!showPicker,
                        palette: !!colorPalette?.length,
                    }}
                    onChange={(newColor) => {
                        // The HexInput component's onChange can only return a string, not a ChangeEvent
                        onChange(colorToHex((newColor as unknown) as tinycolor.ColorInputWithoutInstance));
                    }}
                    className={classes.input}
                    onClick={handleFieldClick}
                />
                <Popper open={isOpen} anchorEl={anchorEl} placement={"bottom-start"} className={classes.popper} disablePortal>
                    <Paper classes={{ root: classes.popperPaper }}>
                        {showPicker && <Picker classes={classes} color={value} onChange={onChange} />}
                        {colorPalette?.length && <Palette classes={classes} colors={colorPalette} onChange={onChange} />}
                    </Paper>
                </Popper>
            </div>
        </ClickAwayListener>
    );
};

export default withStyles(styles, { name: "CometAdminColorPicker", withTheme: true })(CustomPicker(ColorPicker));
