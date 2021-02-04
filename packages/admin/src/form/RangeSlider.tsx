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
    const [minInput, setMinInput] = React.useState(fieldValue.min || 0);
    const [maxInput, setMaxInput] = React.useState(fieldValue.max || 0);
    const InputFieldContainer = components && components.inputFieldContainer ? components.inputFieldContainer : sc.InputFieldContainer;
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number[]) => {
        setMinInput(newValue[0]);
        setMaxInput(newValue[1]);
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
                                value: minInput,
                                type: "number",
                            }}
                            startAdornment={startAdornment ? startAdornment : ""}
                            endAdornment={endAdornment ? endAdornment : ""}
                            onBlur={() => {
                                const minFieldValue = Math.min(minInput, fieldValue.max);
                                if (fieldValue.min !== minFieldValue) {
                                    onChange({ ...fieldValue, min: minFieldValue });
                                    setMinInput(minFieldValue);
                                }
                            }}
                            onChange={(e) => {
                                setMinInput(Number(e.target.value));
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
                                value: maxInput,
                                type: "number",
                            }}
                            startAdornment={startAdornment ? startAdornment : ""}
                            endAdornment={endAdornment ? endAdornment : ""}
                            onBlur={() => {
                                const maxFieldValue = Math.max(fieldValue.min, maxInput);
                                if (fieldValue.max !== maxFieldValue) {
                                    onChange({ ...fieldValue, max: maxFieldValue });
                                    setMaxInput(maxFieldValue);
                                }
                            }}
                            onChange={(e) => {
                                setMaxInput(Number(e.target.value));
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
