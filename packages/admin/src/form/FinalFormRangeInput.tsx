import { FormControl, Slider, SliderProps, Theme, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { InputBase } from "./InputBase";

export type CometAdminFinalFormRangeInputClassKeys =
    | "root"
    | "inputsWrapper"
    | "inputFieldsSeperatorContainer"
    | "sliderWrapper"
    | "inputFieldContainer";

const styles = (theme: Theme) => {
    return createStyles<CometAdminFinalFormRangeInputClassKeys, any>({
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

interface IFinalFormRangeInputProps extends FieldRenderProps<{ min: number; max: number }, HTMLInputElement> {
    min: number;
    max: number;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    sliderProps?: Omit<SliderProps, "min" | "max">;
}

const FinalFormRangeInputComponent: React.FunctionComponent<WithStyles<typeof styles, true> & IFinalFormRangeInputProps> = ({
    classes,
    min,
    max,
    sliderProps,
    startAdornment,
    endAdornment,
    input: { name, onChange, value: fieldValue },
}) => {
    const [internalMinInput, setInternalMinInput] = React.useState(fieldValue.min || 0);
    const [internalMaxInput, setInternalMaxInput] = React.useState(fieldValue.max || 0);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>, newValue: number[]) => {
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
                                min: min,
                                max: fieldValue.max,
                                value: internalMinInput,
                                type: "number",
                            }}
                            startAdornment={startAdornment}
                            endAdornment={endAdornment}
                            onBlur={() => {
                                const minFieldValue = Math.min(internalMinInput, fieldValue.max);
                                if (fieldValue.min !== minFieldValue) {
                                    onChange({ ...fieldValue, min: minFieldValue < min ? min : minFieldValue });
                                }
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setInternalMinInput(Number(e.target.value));
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
                                value: internalMaxInput,
                                type: "number",
                            }}
                            startAdornment={startAdornment ? startAdornment : ""}
                            endAdornment={endAdornment ? endAdornment : ""}
                            onBlur={() => {
                                const maxFieldValue = Math.max(fieldValue.min, internalMaxInput);
                                if (fieldValue.max !== maxFieldValue) {
                                    onChange({ ...fieldValue, max: maxFieldValue > max ? max : maxFieldValue });
                                }
                            }}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setInternalMaxInput(Number(e.target.value));
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
                    ThumbComponent={sliderProps?.ThumbComponent ? sliderProps.ThumbComponent : "span"}
                    onChange={handleSliderChange}
                    {...sliderProps}
                />
            </div>
        </div>
    );
};

export const FinalFormRangeInput = withStyles(styles, { name: "CometAdminFinalFormRangeInput", withTheme: true })(FinalFormRangeInputComponent);
