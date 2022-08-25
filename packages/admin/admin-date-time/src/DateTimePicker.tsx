import { Calendar, Time } from "@comet/admin-icons";
import { ComponentsOverrides, FormControl, InputAdornment, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { DatePicker, DatePickerProps } from "./DatePicker";
import { getDateValueWithTime, getTimeStringFromDate } from "./helpers/timePickerHelpers";
import { TimePicker, TimePickerProps } from "./TimePicker";

export interface DateTimePickerComponentsProps {
    datePicker?: Omit<DatePickerProps, "onChange" | "onBlur" | "value" | "className" | "inputRef" | "fullWidth">;
    timePicker?: Omit<TimePickerProps, "onChange" | "onBlur" | "value" | "className" | "inputRef" | "fullWidth">;
}

export interface DateTimePickerProps {
    onChange?: (value?: Date) => void;
    value?: Date;
    clearable?: boolean;
    componentsProps?: DateTimePickerComponentsProps;
}

function DateTimePicker({
    classes,
    onChange,
    value,
    componentsProps = {},
    ...propsForBothTimePickers
}: DateTimePickerProps & WithStyles<typeof styles>) {
    const datePickerRef = React.useRef<HTMLElement>(null);
    const timePickerRef = React.useRef<HTMLElement>(null);

    const [valueWasUndefinedBeforeLastOnChange, setValueWasUndefinedBeforeLastOnChange] = React.useState(!value);

    const onChangeDateOrTime = (val?: Date | string) => {
        if (val === undefined) {
            onChange?.(undefined);
            setValueWasUndefinedBeforeLastOnChange(true);
        } else {
            setValueWasUndefinedBeforeLastOnChange(false);
        }
    };

    const onChangeDate = (date?: Date) => {
        onChangeDateOrTime(date);

        if (date !== undefined) {
            const dateValueWithTime = value ? value : new Date();
            const newDateValue = getDateValueWithTime(date, getTimeStringFromDate(dateValueWithTime));
            onChange?.(newDateValue);

            if (valueWasUndefinedBeforeLastOnChange) {
                timePickerRef.current?.focus();
            }
        }
    };

    const onChangeTime = (time?: string) => {
        onChangeDateOrTime(time);

        if (time !== undefined) {
            const date = value ? value : new Date();
            onChange?.(getDateValueWithTime(date, time));

            if (valueWasUndefinedBeforeLastOnChange) {
                datePickerRef.current?.focus();
            }
        }
    };

    return (
        <div className={classes.root}>
            <FormControl className={classes.formControl}>
                <DatePicker
                    inputRef={datePickerRef}
                    value={value}
                    className={classes.datePicker}
                    onChange={onChangeDate}
                    fullWidth
                    startAdornment={
                        <InputAdornment position="start">
                            <Calendar />
                        </InputAdornment>
                    }
                    {...propsForBothTimePickers}
                    {...componentsProps.datePicker}
                />
            </FormControl>
            <FormControl className={classes.formControl}>
                <TimePicker
                    inputRef={timePickerRef}
                    value={value ? getTimeStringFromDate(value) : undefined}
                    className={classes.timePicker}
                    onChange={onChangeTime}
                    fullWidth
                    startAdornment={
                        <InputAdornment position="start">
                            <Time />
                        </InputAdornment>
                    }
                    {...propsForBothTimePickers}
                    {...componentsProps.timePicker}
                />
            </FormControl>
        </div>
    );
}

export type DateTimePickerClassKey = "root" | "formControl" | "datePicker" | "timePicker";

export const styles = ({ spacing }: Theme) =>
    createStyles<DateTimePickerClassKey, DateTimePickerProps>({
        root: {
            display: "flex",
            alignItems: "center",
        },
        formControl: {
            flexGrow: 1,
            "&:first-of-type": {
                marginRight: spacing(2),
            },
        },
        datePicker: {},
        timePicker: {},
    });

const DateTimePickerWithStyles = withStyles(styles, { name: "CometAdminDateTimePicker" })(DateTimePicker);

export { DateTimePickerWithStyles as DateTimePicker };

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminDateTimePicker: DateTimePickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminDateTimePicker: DateTimePickerProps;
    }

    interface Components {
        CometAdminDateTimePicker?: {
            defaultProps?: ComponentsPropsList["CometAdminDateTimePicker"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDateTimePicker"];
        };
    }
}
