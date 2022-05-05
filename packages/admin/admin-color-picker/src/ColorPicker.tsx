import { InputWithPopper, InputWithPopperComponents, InputWithPopperComponentsProps, InputWithPopperProps } from "@comet/admin";
import { Box, ComponentsOverrides, InputAdornment, InputBaseProps, Theme } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { HexColorPicker, RgbaStringColorPicker } from "react-colorful";
import { ColorPickerBaseProps } from "react-colorful/dist/types";
import tinycolor from "tinycolor2";
import { useDebouncedCallback } from "use-debounce";

import { ColorPickerClassKey, styles } from "./ColorPicker.styles";

export interface ColorPickerPropsComponents extends InputWithPopperComponents {
    ColorPickerColorPreview?: React.ElementType<ColorPickerColorPreviewProps>;
    ColorPickerInvalidPreview?: React.ElementType<React.HTMLAttributes<HTMLDivElement>>;
    ColorPickerEmptyPreview?: React.ElementType<React.HTMLAttributes<HTMLDivElement>>;
}

export interface ColorPickerPropsComponentsProps extends InputWithPopperComponentsProps {
    hexColorPicker?: Partial<ColorPickerBaseProps<string>>;
    rgbaStringColorPicker?: Partial<ColorPickerBaseProps<string>>;
}

export interface ColorPickerProps extends Omit<InputWithPopperProps, "children" | "onChange" | "value" | "componentsProps" | "components"> {
    value?: string | null;
    onChange?: (color: string | null) => void;
    colorFormat?: "hex" | "rgba";
    colorPalette?: string[];
    hidePicker?: boolean;
    fullWidth?: boolean;
    startAdornment?: InputBaseProps["startAdornment"];
    endAdornment?: InputBaseProps["endAdornment"];
    invalidIndicatorCharacter?: string;
    components?: ColorPickerPropsComponents;
    componentsProps?: ColorPickerPropsComponentsProps;
}

export interface ColorPickerColorPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
    color: string;
}

const ColorPickerPreviewColor = ({ color, ...restProps }: ColorPickerColorPreviewProps): React.ReactElement => {
    return <div {...restProps} style={{ backgroundColor: color }} />;
};

const ColorPicker = ({
    value,
    colorFormat = "hex",
    hidePicker,
    colorPalette,
    onChange,
    startAdornment,
    onBlur,
    classes,
    componentsProps = {},
    components = {},
    ...rest
}: ColorPickerProps & WithStyles<typeof styles>): React.ReactElement => {
    const {
        ColorPickerColorPreview: ColorPreview = ColorPickerPreviewColor,
        ColorPickerInvalidPreview: InvalidPreview = "div",
        ColorPickerEmptyPreview: EmptyPreview = "div",
        ...inputWithPopperComponents
    } = components;

    const {
        hexColorPicker: hexColorPickerProps,
        rgbaStringColorPicker: rgbaStringColorPickerProps,
        ...inputWithPopperComponentsProps
    } = componentsProps;

    const [displayValue, setDisplayValue] = React.useState<string>(value ?? "");
    const previewColor = displayValue ? tinycolor(displayValue) : null;

    React.useEffect(() => {
        setDisplayValue(value ?? "");
    }, [value, setDisplayValue]);

    /**
     * When quickly sliding in the color-picker, multiple `onChange` events would be triggered every second.
     * Debouncing those events ensures the picker is always responsive and prevents it from sometimes crashing.
     */
    const debouncedOnChange = useDebouncedCallback((color) => {
        onChange && onChange(color);
    }, 250);

    const onChangeColor = (color: string) => {
        const colorValue = tinycolor(color);

        if (colorValue.isValid()) {
            const stringValue = colorFormat === "rgba" ? colorValue.toRgbString() : colorValue.toHexString();
            debouncedOnChange(stringValue);
            setDisplayValue(stringValue);
        } else {
            debouncedOnChange(null);
            setDisplayValue("");
        }
    };

    return (
        <InputWithPopper
            startAdornment={
                startAdornment ? (
                    startAdornment
                ) : (
                    <InputAdornment position="start">
                        <div className={classes.preview}>
                            {previewColor ? (
                                previewColor.isValid() ? (
                                    <ColorPreview
                                        className={`${classes.previewIndicator} ${classes.previewIndicatorColor}`}
                                        color={previewColor.toRgbString()}
                                    />
                                ) : (
                                    <InvalidPreview className={`${classes.previewIndicator} ${classes.previewIndicatorInvalid}`}>?</InvalidPreview>
                                )
                            ) : (
                                <EmptyPreview className={`${classes.previewIndicator} ${classes.previewIndicatorEmpty}`} />
                            )}
                        </div>
                    </InputAdornment>
                )
            }
            value={displayValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setDisplayValue(e.currentTarget.value);
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                onBlur && onBlur(e);
                onChangeColor(displayValue);
            }}
            components={inputWithPopperComponents}
            componentsProps={inputWithPopperComponentsProps}
            {...rest}
        >
            {() => {
                return (
                    <div className={classes.popperRoot}>
                        {!hidePicker && (
                            <div className={classes.colorPickerWrapper}>
                                {colorFormat === "hex" && <HexColorPicker color={value ?? ""} onChange={onChangeColor} {...hexColorPickerProps} />}
                                {colorFormat === "rgba" && (
                                    <RgbaStringColorPicker color={value ?? ""} onChange={onChangeColor} {...rgbaStringColorPickerProps} />
                                )}
                            </div>
                        )}
                        {colorPalette?.length && (
                            <div className={classes.colorPalette}>
                                {colorPalette.map((color, index) => (
                                    <Box
                                        className={classes.colorPaletteItem}
                                        key={`${index}_${color}`}
                                        onClick={() => onChangeColor(color)}
                                        sx={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            }}
        </InputWithPopper>
    );
};

const ColorPickerWithStyles = withStyles(styles, { name: "CometAdminColorPicker" })(ColorPicker);
export { ColorPickerWithStyles as ColorPicker };

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminColorPicker: ColorPickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminColorPicker: ColorPickerProps;
    }

    interface Components {
        CometAdminColorPicker?: {
            defaultProps?: ComponentsPropsList["CometAdminColorPicker"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminColorPicker"];
        };
    }
}
