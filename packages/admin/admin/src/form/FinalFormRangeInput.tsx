import { FormControl, InputBase, Slider, SliderProps } from "@mui/material";
import { ComponentsOverrides, css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type FinalFormRangeInputClassKey =
    | "root"
    | "disableSlider"
    | "inputsWrapper"
    | "inputFieldsSeparatorContainer"
    | "sliderWrapper"
    | "inputFieldContainer";

type OwnerState = {
    disableSlider: boolean;
};

const Root = createComponentSlot("div")<FinalFormRangeInputClassKey, OwnerState>({
    componentName: "FinalFormRangeInput",
    slotName: "root",
    classesResolver: ({ disableSlider }) => [disableSlider && "disableSlider"],
})(css`
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
`);

const InputsWrapper = createComponentSlot("div")<FinalFormRangeInputClassKey, OwnerState>({
    componentName: "FinalFormRangeInput",
    slotName: "inputsWrapper",
})(
    ({ theme, ownerState }) => css`
        justify-content: space-between;
        align-items: center;
        display: flex;

        ${!ownerState.disableSlider &&
        css`
            margin-bottom: ${theme.spacing(3)};
        `}
    `,
);

const InputFieldsSeparatorContainer = createComponentSlot("div")<FinalFormRangeInputClassKey>({
    componentName: "FinalFormRangeInput",
    slotName: "inputFieldsSeparatorContainer",
})(css`
    text-align: center;
    min-width: 20%;
`);

const SliderWrapper = createComponentSlot("div")<FinalFormRangeInputClassKey>({
    componentName: "FinalFormRangeInput",
    slotName: "sliderWrapper",
})();

const InputFieldContainer = createComponentSlot("div")<FinalFormRangeInputClassKey>({
    componentName: "FinalFormRangeInput",
    slotName: "inputFieldContainer",
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
    separator?: React.ReactNode;
    disableSlider?: boolean;
    sliderProps?: Omit<SliderProps, "min" | "max">;
}

export function FinalFormRangeInput(inProps: FinalFormRangeInputProps) {
    const {
        min,
        max,
        startAdornment,
        endAdornment,
        separator = <FormattedMessage id="comet.rangeInput.separator" defaultMessage="to" />,
        disableSlider,
        sliderProps,
        input: { name, onChange, value: fieldValue },
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminFinalFormRangeInput" });

    const [internalMinInput, setInternalMinInput] = React.useState(fieldValue.min || undefined);
    const [internalMaxInput, setInternalMaxInput] = React.useState(fieldValue.max || undefined);

    const handleSliderChange = (event: Event, newValue: number[]) => {
        onChange({ min: newValue[0], max: newValue[1] });
    };

    const ownerState: OwnerState = { disableSlider: Boolean(disableSlider) };

    React.useEffect(() => {
        setInternalMinInput(fieldValue.min);
        setInternalMaxInput(fieldValue.max);
    }, [fieldValue]);

    return (
        <Root ownerState={ownerState} {...slotProps?.root} {...restProps}>
            <InputsWrapper ownerState={ownerState} {...slotProps?.inputsWrapper}>
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
                <InputFieldsSeparatorContainer {...slotProps?.inputFieldsSeparatorContainer}>{separator}</InputFieldsSeparatorContainer>
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
            {!disableSlider && (
                <SliderWrapper {...slotProps?.sliderWrapper}>
                    <Slider
                        min={min}
                        max={max}
                        value={[fieldValue.min ? fieldValue.min : min, fieldValue.max ? fieldValue.max : max]}
                        onChange={handleSliderChange}
                        {...sliderProps}
                    />
                </SliderWrapper>
            )}
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
