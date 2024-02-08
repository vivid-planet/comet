import { FormControl, InputBase, Slider, SliderProps } from "@mui/material";
import { ComponentsOverrides, css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

export type FinalFormRangeInputClassKey = "root" | "inputsWrapper" | "inputFieldsSeparatorContainer" | "sliderWrapper" | "inputFieldContainer";

const Root = styled("div", {
    name: "CometAdminFinalFormRangeInput",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
`);

const InputsWrapper = styled("div", {
    name: "CometAdminFinalFormRangeInput",
    slot: "inputsWrapper",
    overridesResolver(_, styles) {
        return [styles.inputsWrapper];
    },
})(
    css`
        justify-content: space-between;
        margin-bottom: 15px;
        align-items: center;
        display: flex;
    `,
);

const InputFieldsSeparatorContainer = styled("div", {
    name: "CometAdminFinalFormRangeInput",
    slot: "inputFieldsSeparatorContainer",
    overridesResolver(_, styles) {
        return [styles.inputFieldsSeparatorContainer];
    },
})(css`
    text-align: center;
    min-width: 20%;
`);

const SliderWrapper = styled("div", {
    name: "CometAdminFinalFormRangeInput",
    slot: "sliderWrapper",
    overridesResolver(_, styles) {
        return [styles.sliderWrapper];
    },
})(css``);

const InputFieldContainer = styled("div", {
    name: "CometAdminFinalFormRangeInput",
    slot: "inputFieldContainer",
    overridesResolver(_, styles) {
        return [styles.inputFieldContainer];
    },
})(css`
    text-align: center;
    flex-basis: 0;
    flex-grow: 1;
`);

export interface FinalFormRangeInputProps
    extends FieldRenderProps<{ min: number; max: number }, HTMLInputElement>,
        ThemedComponentBaseProps<{
            root: "div";
            inputsWrapper: "div";
            inputFieldsSeparatorContainer: "div";
            sliderWrapper: "div";
            inputFieldContainer: "div";
        }> {
    min: number;
    max: number;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    sliderProps?: Omit<SliderProps, "min" | "max">;
}

export function FinalFormRangeInput(inProps: FinalFormRangeInputProps) {
    const {
        min,
        max,
        sliderProps,
        startAdornment,
        endAdornment,
        input: { name, onChange, value: fieldValue },
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminFinalFormRangeInput" });

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
        <Root {...slotProps?.root} {...restProps}>
            <InputsWrapper {...slotProps?.inputsWrapper}>
                <InputFieldContainer {...slotProps?.inputFieldContainer}>
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
                </InputFieldContainer>
                <InputFieldsSeparatorContainer {...slotProps?.inputFieldsSeparatorContainer}>-</InputFieldsSeparatorContainer>
                <InputFieldContainer {...slotProps?.inputFieldContainer}>
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
                </InputFieldContainer>
            </InputsWrapper>
            <SliderWrapper {...slotProps?.sliderWrapper}>
                <Slider
                    min={min}
                    max={max}
                    value={[fieldValue.min ? fieldValue.min : min, fieldValue.max ? fieldValue.max : max]}
                    onChange={handleSliderChange}
                    {...sliderProps}
                />
            </SliderWrapper>
        </Root>
    );
}

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
