import { FormControl, Slider, SliderProps, Theme, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { InputBase } from "./InputBase";

export type CometAdminRangeSliderClassKeys = "root" | "inputsWrapper" | "inputFieldsSeperatorContainer" | "sliderWrapper" | "inputFieldContainer";

const styles = (theme: Theme) => {
    return createStyles<CometAdminRangeSliderClassKeys, any>({
        root: {
            padding: "0 20px",
            width: "100%",
        },
        inputsWrapper: {
            justifyContent: "space-between",
            marginBottom: "15px",
            alignItems: "center",
            display: "flex",
        },
        inputFieldsSeperatorContainer: {
            textAlign: "center",
            minWidth: "20%",
        },
        sliderWrapper: {
            paddingBottom: "20px",
        },
        inputFieldContainer: {
            textAlign: "center",
        },
    });
};

interface IRangeSliderProps extends FieldRenderProps<any, HTMLInputElement> {
    name: string;
    min: number;
    max: number;
    startAdornment?: string | React.ReactElement;
    endAdornment?: string | React.ReactElement;
    sliderProps?: SliderProps;
}

const RangeSliderComponent: React.FunctionComponent<WithStyles<typeof styles, true> & IRangeSliderProps> = ({
    classes,
    min,
    max,
    sliderProps,
    startAdornment,
    endAdornment,
    input: { name, onChange, value: fieldValue },
}) => {
    const [minInput, setMinInput] = React.useState(fieldValue.min || 0);
    const [maxInput, setMaxInput] = React.useState(fieldValue.max || 0);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number[]) => {
        setMinInput(newValue[0]);
        setMaxInput(newValue[1]);
        onChange({ min: newValue[0], max: newValue[1] });
    };

    return (
        <div className={classes.root}>
            <div className={classes.inputsWrapper}>
                <div className={classes.inputFieldContainer}>
                    <FormControl fullWidth>
                        <InputBase
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
                                    onChange({ ...fieldValue, min: minFieldValue < min ? min : minFieldValue });
                                    setMinInput(minFieldValue < min ? min : minFieldValue);
                                }
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setMinInput(Number(e.target.value));
                            }}
                        />
                    </FormControl>
                </div>
                <div className={classes.inputFieldsSeperatorContainer}>-</div>
                <div className={classes.inputFieldContainer}>
                    <FormControl fullWidth>
                        <InputBase
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
                                    onChange({ ...fieldValue, max: maxFieldValue > max ? max : maxFieldValue });
                                    setMaxInput(maxFieldValue > max ? max : maxFieldValue);
                                }
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setMaxInput(Number(e.target.value));
                            }}
                        />
                    </FormControl>
                </div>
            </div>
            <div className={classes.sliderWrapper}>
                <Slider
                    min={min}
                    max={max}
                    value={[fieldValue.min, fieldValue.max]}
                    aria-labelledby="range-slider"
                    ThumbComponent={sliderProps?.ThumbComponent ? sliderProps.ThumbComponent : "span"}
                    onChange={handleSliderChange}
                />
            </div>
        </div>
    );
};

export const RangeSlider = withStyles(styles, { name: "CometAdminRangeSlider", withTheme: true })(RangeSliderComponent);
