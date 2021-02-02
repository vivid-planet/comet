import { FormControl, Input, Slider } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import * as sc from "./RangeSlider.sc";
interface IRangeSliderProps extends FieldRenderProps<any, HTMLInputElement> {
    name: string;
    min: number;
    max: number;
    startAdornment?: string | React.ReactElement;
    endAdornment?: string | React.ReactElement;
    thumb?: React.ElementType<React.HTMLAttributes<HTMLSpanElement | HTMLDivElement>>;
    components?: {
        inputFieldContainer?: React.ComponentType;
    };
}
export const RangeSlider: React.FunctionComponent<IRangeSliderProps> = ({
    min,
    max,
    thumb,
    components,
    startAdornment,
    endAdornment,
    input: { name, onChange, value: fieldValue },
}) => {
    const InputFieldContainer = components && components.inputFieldContainer ? components.inputFieldContainer : sc.InputFieldContainer;
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number[]) => {
        onChange({ min: newValue[0], max: newValue[1] });
    };

    return (
        <sc.Wrapper>
            <sc.InputsWrapper>
                <InputFieldContainer>
                    <FormControl>
                        <Input
                            name={`${name}.min`}
                            inputProps={{
                                min: min,
                                max: fieldValue.max,
                                value: fieldValue.min,
                                type: "number",
                            }}
                            startAdornment={startAdornment ? startAdornment : ""}
                            endAdornment={endAdornment ? endAdornment : ""}
                            onBlur={() => {
                                const minfieldValue = Math.min(fieldValue.min, fieldValue.max);
                                if (fieldValue.min !== minfieldValue) {
                                    onChange({ ...fieldValue, min: minfieldValue });
                                }
                            }}
                            onChange={(e) => {
                                onChange({ ...fieldValue, min: Number(e.target.value) });
                            }}
                        />
                    </FormControl>
                </InputFieldContainer>
                <sc.InputFieldsSeperatorContainer>-</sc.InputFieldsSeperatorContainer>
                <InputFieldContainer>
                    <FormControl>
                        <Input
                            name={`${name}.max`}
                            inputProps={{
                                min: fieldValue.min,
                                max: max,
                                value: fieldValue.max,
                                type: "number",
                            }}
                            startAdornment={startAdornment ? startAdornment : ""}
                            endAdornment={endAdornment ? endAdornment : ""}
                            onBlur={() => {
                                const maxfieldValue = Math.max(fieldValue.min, fieldValue.max);
                                if (fieldValue.max !== maxfieldValue) {
                                    onChange({ ...fieldValue, max: maxfieldValue });
                                }
                            }}
                            onChange={(e) => {
                                onChange({ ...fieldValue, max: Number(e.target.value) });
                            }}
                        />
                    </FormControl>
                </InputFieldContainer>
            </sc.InputsWrapper>
            <sc.SliderWrapper>
                <Slider
                    min={min}
                    max={max}
                    value={[fieldValue.min, fieldValue.max]}
                    aria-labelledby="range-slider"
                    ThumbComponent={thumb ? thumb : "span"}
                    onChange={handleSliderChange}
                />
            </sc.SliderWrapper>
        </sc.Wrapper>
    );
};
