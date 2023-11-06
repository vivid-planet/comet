import { ComponentsOverrides, FormControl } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { useIntl } from "react-intl";

import { DatePicker, DatePickerProps } from "./DatePicker";
import { getDateWithNewTime, getTimeStringFromDate } from "./helpers/timePickerHelpers";
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
    const intl = useIntl();
    const datePickerRef = React.useRef<HTMLElement>(null);
    const timePickerRef = React.useRef<HTMLElement>(null);

    const onChangeDate = (newDate?: Date) => {
        if (newDate === undefined) {
            onChange?.(undefined);
        } else {
            const timePickerShouldBeFocused = !value;
            const time = getTimeStringFromDate(value ? value : new Date());
            const newDateTime = getDateWithNewTime(newDate, time);
            onChange?.(newDateTime);

            if (timePickerShouldBeFocused) {
                timePickerRef.current?.focus();
            }
        }
    };

    const onChangeTime = (newTime?: string) => {
        if (newTime === undefined) {
            onChange?.(undefined);
        } else {
            const datePickerShouldBeFocused = !value;
            const date = value ? value : new Date();
            const newDateTime = getDateWithNewTime(date, newTime);
            onChange?.(newDateTime);

            if (datePickerShouldBeFocused) {
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
                    {...propsForBothTimePickers}
                    {...componentsProps.datePicker}
                />
            </FormControl>
            <FormControl className={classes.formControl}>
                <TimePicker
                    inputRef={timePickerRef}
                    value={value ? getTimeStringFromDate(value) : undefined}
                    placeholder={intl.formatMessage({ id: "comet.timeTimePicker.time", defaultMessage: "Time" })}
                    className={classes.timePicker}
                    onChange={onChangeTime}
                    fullWidth
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
        CometAdminDateTimePicker: Partial<DateTimePickerProps>;
    }

    interface Components {
        CometAdminDateTimePicker?: {
            defaultProps?: ComponentsPropsList["CometAdminDateTimePicker"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDateTimePicker"];
        };
    }
}
