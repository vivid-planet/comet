import { ClearInputButton } from "@comet/admin";
import { ClickAwayListener, InputAdornment, InputBase, InputBaseProps, Paper, Popper } from "@mui/material";
import { WithStyles } from "@mui/styles";
import withStyles from "@mui/styles/withStyles";
import * as React from "react";
import { CustomPicker } from "react-color";
import { FieldRenderProps } from "react-final-form";
import tinycolor from "tinycolor2";

import { colorToHex } from "../utils/colorSpaces";
import { ColorPickerClassKey, styles } from "./ColorPicker.styles";
import { HexInput } from "./HexInput";
import Palette from "./Palette";
import PickedColor from "./PickedColor";
import Picker from "./Picker";

export interface ColorPickerProps extends FieldRenderProps<string, HTMLInputElement> {
    colorPalette?: string[];
    showPicker?: boolean;
    showClearButton?: boolean;
    fullWidth?: boolean;
    startAdornment?: InputBaseProps["startAdornment"];
    endAdornment?: InputBaseProps["endAdornment"];
}

function ColorPicker({
    colorPalette,
    showPicker,
    fullWidth,
    showClearButton,
    startAdornment,
    endAdornment,
    classes,
    input: { value, onChange },
}: ColorPickerProps & WithStyles<typeof styles>): React.ReactElement {
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
                    startAdornment={
                        startAdornment ? (
                            startAdornment
                        ) : (
                            <InputAdornment position="start">
                                {/* TODO: Fix this */}
                                {/* @ts-ignore */}
                                <PickedColor value={value} classes={classes} />
                            </InputAdornment>
                        )
                    }
                    endAdornment={
                        endAdornment ? (
                            endAdornment
                        ) : showClearButton ? (
                            <InputAdornment position="end">
                                <ClearInputButton onClick={() => onChange("")} disabled={!value} />
                            </InputAdornment>
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
                        onChange(colorToHex(newColor as unknown as tinycolor.ColorInputWithoutInstance));
                    }}
                    className={classes.input}
                    onClick={handleFieldClick}
                />
                <Popper open={isOpen} anchorEl={anchorEl} placement={"bottom-start"} className={classes.popper} disablePortal>
                    <Paper classes={{ root: classes.popperPaper }}>
                        {/* TODO: Fix this */}
                        {/* @ts-ignore */}
                        {showPicker && <Picker classes={classes} color={value} onChange={onChange} />}
                        {/* TODO: Fix this */}
                        {/* @ts-ignore */}
                        {colorPalette?.length && <Palette classes={classes} colors={colorPalette} onChange={onChange} />}
                    </Paper>
                </Popper>
            </div>
        </ClickAwayListener>
    );
}

export default withStyles(styles, { name: "CometAdminColorPicker" })(CustomPicker(ColorPicker));

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminColorPicker: ColorPickerClassKey;
    }
}

declare module "@mui/material/styles/props" {
    interface ComponentsPropsList {
        CometAdminColorPicker: ColorPickerProps;
    }
}
