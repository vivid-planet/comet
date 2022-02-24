import { ComponentsOverrides, FormControl, InputBase, Slider, SliderProps, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

export type FinalFormRangeInputClassKey = "root" | "inputsWrapper" | "inputFieldsSeparatorContainer" | "sliderWrapper" | "inputFieldContainer";

const styles = () => {
    return createStyles<FinalFormRangeInputClassKey, FinalFormRangeInputProps>({
        root: {
            boxSizing: "border-box",
            padding: "0 20px",
            width: "100%",
        },
        inputsWrapper: {
            justifyContent: "space-between",
            marginBottom: "15px",
            alignItems: "center",
            display: "flex",
        },
        inputFieldsSeparatorContainer: {
            textAlign: "center",
            minWidth: "20%",
        },
        sliderWrapper: {},
        inputFieldContainer: {
            textAlign: "center",
            flexBasis: 0,
            flexGrow: 1,
        },
    });
};

export interface FinalFormRangeInputProps extends FieldRenderProps<{ min: number; max: number }, HTMLInputElement> {
    min: number;
    max: number;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    sliderProps?: Omit<SliderProps, "min" | "max">;
}

const FinalFormRangeInputComponent: React.FunctionComponent<WithStyles<typeof styles> & FinalFormRangeInputProps> = ({
    classes,
    min,
    max,
    sliderProps,
    startAdornment,
    endAdornment,
    input: { name, onChange, value: fieldValue },
}) => {
    const [internalMinInput, setInternalMinInput] = React.useState(fieldValue.min || undefined);
    const [internalMaxInput, setInternalMaxInput] = React.useState(fieldValue.max || undefined);

    const handleSliderChange = (event: Event, newValue: number[]) => {
        onChange({ min: newValue[0], max: newValue[1] });
    };

    React.useEffect(() => {
        setInternalMinInput(fieldValue.min);
        setInternalMaxInput(fieldValue.max);
    }, [fieldValue]);

    return (
        <div className={classes.root}>
            <div className={classes.inputsWrapper}>
                <div className={classes.inputFieldContainer}>
                    <FormControl fullWidth>
                        <InputBase
                            name={`${name}.min`}
                            inputProps={{
                                value: internalMinInput !== undefined ? internalMinInput : "",
                                type: "number",
                                placeholder: min.toString(),
                            }}
                            startAdornment={startAdornment}
                            endAdornment={endAdornment}
                            onBlur={() => {
                                if (internalMinInput !== undefined) {
                                    const minFieldValue = Math.min(internalMinInput ? internalMinInput : min, fieldValue.max ? fieldValue.max : max);
                                    onChange({
                                        min: minFieldValue < min ? min : minFieldValue,
                                        max: internalMaxInput === undefined ? max : internalMaxInput,
                                    });
                                } else {
                                    onChange(undefined);
                                }
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.value === "") {
                                    setInternalMinInput(undefined);
                                } else {
                                    setInternalMinInput(Number(e.target.value));
                                }
                            }}
                        />
                    </FormControl>
                </div>
                <div className={classes.inputFieldsSeparatorContainer}>-</div>
                <div className={classes.inputFieldContainer}>
                    <FormControl fullWidth>
                        <InputBase
                            name={`${name}.max`}
                            inputProps={{
                                value: internalMaxInput !== undefined ? internalMaxInput : "",
                                type: "number",
                                placeholder: max.toString(),
                            }}
                            startAdornment={startAdornment ? startAdornment : ""}
                            endAdornment={endAdornment ? endAdornment : ""}
                            onBlur={() => {
                                if (internalMaxInput !== undefined) {
                                    const maxFieldValue = Math.max(fieldValue.min ? fieldValue.min : min, internalMaxInput ? internalMaxInput : max);
                                    onChange({
                                        min: internalMinInput === undefined ? min : internalMinInput,
                                        max: maxFieldValue > max ? max : maxFieldValue,
                                    });
                                } else {
                                    onChange(undefined);
                                }
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.value === "") {
                                    setInternalMaxInput(undefined);
                                } else {
                                    setInternalMaxInput(Number(e.target.value));
                                }
                            }}
                        />
                    </FormControl>
                </div>
            </div>
            <div className={classes.sliderWrapper}>
                <Slider
                    min={min}
                    max={max}
                    value={[fieldValue.min ? fieldValue.min : min, fieldValue.max ? fieldValue.max : max]}
                    components={{ Thumb: sliderProps?.components?.Thumb ? sliderProps.components.Thumb : "span" }}
                    onChange={handleSliderChange}
                    {...sliderProps}
                />
            </div>
        </div>
    );
};

export const FinalFormRangeInput = withStyles(styles, { name: "CometAdminFinalFormRangeInput" })(FinalFormRangeInputComponent);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFinalFormRangeInput: FinalFormRangeInputClassKey;
    }

    interface Components {
        CometAdminFinalFormRangeInput?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFinalFormRangeInput"];
        };
    }
}
