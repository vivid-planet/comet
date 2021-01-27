import { Slider } from "@material-ui/core";
import * as React from "react";
import { useField } from "react-final-form";

import { Input } from "./Input";
import * as sc from "./RangeSlider.sc";

interface IMinMaxValue {
    min: number;
    max: number;
}

interface IRangeSliderProps {
    rangeValues: IMinMaxValue;
    startAdornment?: string | React.ReactElement;
    endAdornment?: string | React.ReactElement;
    thumb?: React.ElementType<React.HTMLAttributes<HTMLSpanElement | HTMLDivElement>>;
    components?: {
        inputFieldContainer?: React.ComponentType;
    };
}

export const RangeSlider: React.FunctionComponent<IRangeSliderProps> = ({ rangeValues, thumb, components, startAdornment, endAdornment }) => {
    const [minValue, setMinValue] = React.useState<number>(rangeValues?.min || 0);
    const [maxValue, setMaxValue] = React.useState<number>(rangeValues?.max || 0);

    const InputFieldContainer = components && components.inputFieldContainer ? components.inputFieldContainer : sc.InputFieldContainer;

    const minField = useField<number, HTMLInputElement>("min", {
        initialValue: minValue,
    });
    const maxField = useField<number, HTMLInputElement>("max", {
        initialValue: maxValue,
    });

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number[]) => {
        if (minValue !== newValue[0]) {
            setMinValue(newValue[0]);
            minField.input.onChange(newValue[0]);
        }
        if (maxValue !== newValue[1]) {
            setMaxValue(newValue[1]);
            maxField.input.onChange(newValue[1]);
        }
    };

    return (
        <sc.Wrapper>
            {!!rangeValues && (
                <>
                    <sc.InputsWrapper>
                        <InputFieldContainer>
                            <Input
                                {...minField}
                                inputProps={{
                                    min: rangeValues.min,
                                    max: maxField.input.value,
                                    value: minValue,
                                    type: "number",
                                }}
                                startAdornment={startAdornment ? startAdornment : ""}
                                endAdornment={endAdornment ? endAdornment : ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const min = Number(e.target.value);
                                    setMinValue(Number(e.target.value));
                                    minField.input.onChange(min > maxValue ? maxValue : min);
                                }}
                                onBlur={() => {
                                    const minInputValue = Math.min(minValue, maxValue);
                                    if (minValue !== minInputValue) {
                                        setMinValue(minInputValue);
                                    }
                                }}
                            />
                        </InputFieldContainer>
                        <sc.InputFieldsSeperatorContainer>-</sc.InputFieldsSeperatorContainer>
                        <InputFieldContainer>
                            <Input
                                {...maxField}
                                inputProps={{
                                    min: minField.input.value,
                                    max: rangeValues.max,
                                    value: maxValue,
                                    type: "number",
                                }}
                                startAdornment={startAdornment ? startAdornment : ""}
                                endAdornment={endAdornment ? endAdornment : ""}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const max = Number(e.target.value);
                                    setMaxValue(max);
                                    maxField.input.onChange(max < minValue ? minValue : max);
                                }}
                                onBlur={() => {
                                    const maxInputValue = Math.max(minValue, maxValue);
                                    if (maxValue !== maxInputValue) {
                                        setMaxValue(maxInputValue);
                                    }
                                }}
                            />
                        </InputFieldContainer>
                    </sc.InputsWrapper>
                    <sc.SliderWrapper>
                        <Slider
                            min={rangeValues.min}
                            max={rangeValues.max}
                            value={[minField.input.value, maxField.input.value]}
                            aria-labelledby="range-slider"
                            ThumbComponent={thumb ? thumb : "span"}
                            onChange={handleSliderChange}
                        />
                    </sc.SliderWrapper>
                </>
            )}
        </sc.Wrapper>
    );
};
