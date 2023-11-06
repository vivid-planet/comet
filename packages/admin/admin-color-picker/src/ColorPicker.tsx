import { ClearInputAdornment, InputWithPopper, InputWithPopperComponents, InputWithPopperComponentsProps, InputWithPopperProps } from "@comet/admin";
import { Close } from "@comet/admin-icons";
import { Box, ButtonBase, ComponentsOverrides, IconButton, InputAdornment, InputBaseProps, Theme, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";
import { HexColorPicker, RgbaStringColorPicker } from "react-colorful";
import { ColorPickerBaseProps } from "react-colorful/dist/types";
import { FormattedMessage } from "react-intl";
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
    onChange?: (color?: string) => void;
    colorFormat?: "hex" | "rgba";
    colorPalette?: string[];
    hidePicker?: boolean;
    hideHeader?: boolean;
    hideFooter?: boolean;
    fullWidth?: boolean;
    startAdornment?: InputBaseProps["startAdornment"];
    endAdornment?: InputBaseProps["endAdornment"];
    invalidIndicatorCharacter?: string;
    clearable?: boolean;
    titleText?: React.ReactNode;
    clearButtonText?: React.ReactNode;
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
    classes,
    value,
    colorFormat = "hex",
    hidePicker,
    hideHeader,
    hideFooter,
    colorPalette,
    onChange,
    startAdornment,
    endAdornment,
    onBlur,
    clearable,
    titleText = <FormattedMessage id="comet.colorPicker.title" defaultMessage="Choose a color" />,
    clearButtonText = <FormattedMessage id="comet.colorPicker.clearButton" defaultMessage="clear color" />,
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
                    <InputAdornment position="start" disablePointerEvents>
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
            endAdornment={
                clearable ? (
                    <>
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(value)} onClick={() => onChange && onChange(undefined)} />
                        {endAdornment}
                    </>
                ) : (
                    endAdornment
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
            {(closePopper) => {
                return (
                    <div className={classes.popperRoot}>
                        {!hideHeader && (
                            <div className={clsx(classes.popperSection, classes.header)}>
                                <Typography className={classes.headerTitleText}>{titleText}</Typography>
                                <IconButton className={classes.headerCloseButton} onClick={() => closePopper(true)}>
                                    <Close />
                                </IconButton>
                            </div>
                        )}

                        {!hidePicker && (
                            <div className={clsx(classes.popperSection, classes.colorPickerWrapper)}>
                                {colorFormat === "hex" && <HexColorPicker color={value ?? ""} onChange={onChangeColor} {...hexColorPickerProps} />}
                                {colorFormat === "rgba" && (
                                    <RgbaStringColorPicker color={value ?? ""} onChange={onChangeColor} {...rgbaStringColorPickerProps} />
                                )}
                            </div>
                        )}
                        {colorPalette?.length && (
                            <div className={clsx(classes.popperSection, classes.colorPalette)}>
                                {colorPalette.map((color, index) => (
                                    <Box
                                        className={classes.colorPaletteItem}
                                        key={`${index}_${color}`}
                                        onClick={() => {
                                            onChangeColor(color);
                                            closePopper(true);
                                        }}
                                        sx={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        )}
                        {!hideFooter && (
                            <div className={clsx(classes.popperSection, classes.footer)}>
                                <ButtonBase
                                    className={classes.footerClearButton}
                                    onClick={() => {
                                        onChangeColor("");
                                        closePopper(true);
                                    }}
                                >
                                    <div className={classes.preview}>
                                        <EmptyPreview className={`${classes.previewIndicator} ${classes.previewIndicatorEmpty}`} />
                                    </div>
                                    <Typography>{clearButtonText}</Typography>
                                </ButtonBase>
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
        CometAdminColorPicker: Partial<ColorPickerProps>;
    }

    interface Components {
        CometAdminColorPicker?: {
            defaultProps?: ComponentsPropsList["CometAdminColorPicker"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminColorPicker"];
        };
    }
}
