import { Slider } from "@material-ui/core";
import * as React from "react";
import { Field } from "./Field";
import { Input } from "./Input";
import * as sc from "./RangeSlider.sc";

interface IMinMaxValue {
    min: number;
    max: number;
}

interface IInput {
    onChange: (newValue: IMinMaxValue) => void;
    value: IMinMaxValue | string;
}

interface IRangeSliderProps {
    rangeValues: IMinMaxValue;
    rangeSliderType: string;
    input: IInput;
    handleSubmit: () => void;
    thumb?: React.ElementType<React.HTMLAttributes<HTMLSpanElement | HTMLDivElement>>;
    components?: {
        inputFieldContainer?: React.ComponentType;
    };
}

export const RangeSlider: React.FunctionComponent<IRangeSliderProps> = ({ rangeValues, input, rangeSliderType, handleSubmit, thumb, components }) => {
    const [filterValues, setFilterValues] = React.useState<{ rangeSliderValues: number[]; inputValues: number[] }>(() => {
        if (input.value === "") {
            return {
                rangeSliderValues: [0, 0],
                inputValues: [0, 0],
            };
        } else {
            return {
                rangeSliderValues: [(input.value as IMinMaxValue).min, (input.value as IMinMaxValue).max],
                inputValues: [(input.value as IMinMaxValue).min, (input.value as IMinMaxValue).max],
            };
        }
    });

    const InputFieldContainer = components && components.inputFieldContainer ? components.inputFieldContainer : sc.InputFieldContainer;

    const minInputRef = React.useRef<HTMLInputElement>(null);
    const maxInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (rangeValues) {
            if (input.value === "") {
                setFilterValues({
                    rangeSliderValues: [rangeValues.min, rangeValues.max],
                    inputValues: [rangeValues.min, rangeValues.max],
                });
            }
        }
    }, [rangeValues]);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number[]) => {
        setFilterValues({ inputValues: newValue, rangeSliderValues: newValue });
    };

    const handleBlur = () => {
        setFilterValues({ ...filterValues, inputValues: [...filterValues.rangeSliderValues] });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            setFilterValues({ ...filterValues, inputValues: [...filterValues.rangeSliderValues] });
            handleSubmit();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isMin: boolean) => {
        const newFilterValues = { rangeSliderValues: [...filterValues.rangeSliderValues], inputValues: [...filterValues.inputValues] };
        if (isMin) {
            newFilterValues.rangeSliderValues[0] = Number(e.target.value);

            if (Number(e.target.value) < rangeValues.min) {
                newFilterValues.rangeSliderValues[0] = rangeValues.min;
            }
            if (Number(e.target.value) > filterValues.rangeSliderValues[1]) {
                newFilterValues.rangeSliderValues[0] = filterValues.rangeSliderValues[1];
            }
            newFilterValues.inputValues[0] = Number(e.target.value);
        } else {
            newFilterValues.rangeSliderValues[1] = Number(e.target.value);

            if (Number(e.target.value) > rangeValues.max) {
                newFilterValues.rangeSliderValues[1] = rangeValues.max;
            }
            if (Number(e.target.value) < filterValues.rangeSliderValues[0]) {
                newFilterValues.rangeSliderValues[1] = filterValues.rangeSliderValues[0];
            }

            newFilterValues.inputValues[1] = Number(e.target.value);
        }

        if (input.onChange) {
            input.onChange({ min: newFilterValues.rangeSliderValues[0], max: newFilterValues.rangeSliderValues[1] });
            setFilterValues(newFilterValues);
        }
    };

    return (
        <sc.Wrapper>
            {!!rangeValues && (
                <>
                    <sc.InputsWrapper>
                        <Field
                            name={"min"}
                            inputProps={{
                                min: String(rangeValues.min),
                                max: String(filterValues.inputValues[1]),
                                value: filterValues.inputValues[0],
                            }}
                            type="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleInputChange(e, true);
                            }}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            component={Input}
                            fieldContainerComponent={InputFieldContainer}
                            inputRef={minInputRef}
                            startAdornment={rangeSliderType === "price" ? <span>€</span> : ""}
                        />
                        <sc.InputFieldsSeperatorContainer>-</sc.InputFieldsSeperatorContainer>
                        <Field
                            onKeyDown={handleKeyDown}
                            name={"max"}
                            inputProps={{
                                min: String(filterValues.inputValues[0]),
                                max: String(rangeValues.max),
                                value: filterValues.inputValues[1],
                            }}
                            type="text"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleInputChange(e, false);
                            }}
                            onBlur={handleBlur}
                            component={Input}
                            fieldContainerComponent={InputFieldContainer}
                            inputRef={maxInputRef}
                            startAdornment={rangeSliderType === "price" ? <span>€</span> : ""}
                        />
                    </sc.InputsWrapper>
                    <sc.SliderWrapper>
                        <Slider
                            min={rangeValues.min}
                            max={rangeValues.max}
                            value={filterValues.rangeSliderValues}
                            onChange={handleSliderChange}
                            onChangeCommitted={(e, newValue: number[]) => {
                                if (input.onChange) {
                                    input.onChange({ min: newValue[0], max: newValue[1] });
                                }
                            }}
                            aria-labelledby="range-slider"
                            ThumbComponent={!!thumb ? thumb : "span"}
                        />
                    </sc.SliderWrapper>
                </>
            )}
        </sc.Wrapper>
    );
};
