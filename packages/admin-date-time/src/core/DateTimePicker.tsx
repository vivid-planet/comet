import { FormControl, FormLabel, WithStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import * as moment from "moment";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import { DatePickerThemeProps, FinalFormDatePicker } from "./DatePicker";
import styles from "./DateTimePicker.styles";
import { FinalFormTimePicker, TimePickerProps } from "./TimePicker";

export interface DateTimePickerProps {
    fullWidth?: boolean;
    placeholder?: string;
    dateInputLabel?: string;
    timeInputLabel?: string;
    datePickerProps?: DatePickerThemeProps;
    timePickerProps?: TimePickerProps;
}

const DateTime: React.FC<WithStyles<typeof styles> & DateTimePickerProps & FieldRenderProps<string | Date, HTMLInputElement>> = ({
    classes,
    input,
    fullWidth = false,
    meta,
    dateInputLabel,
    timeInputLabel,
    disabled,
    datePickerProps,
    timePickerProps,
}) => {
    const intl = useIntl();
    const localeName = intl.locale;
    const { onChange, ...otherInput } = input;

    React.useEffect(() => {
        moment.locale(localeName);
    }, [localeName]);

    const onDateChange = (newDateValue: Date | null) => {
        if (!newDateValue) onChange(null);

        const newDateString = moment(newDateValue).format("YYYY-MM-DD");
        const currentValue = moment(input.value);

        if (currentValue.isValid()) {
            const currentTimeString = moment(input.value).format("HH:mm");
            const newDate = moment(`${newDateString} ${currentTimeString}`);
            onChange(newDate.toDate());
        } else {
            const nextFullHourString = moment().add(59, "minutes").startOf("hour").format("HH:mm");
            onChange(moment(`${newDateString} ${nextFullHourString}`).toDate());
        }
    };

    const onTimeChange = (newTimeValue: string | null) => {
        if (!newTimeValue) onChange(null);

        const currentValue = moment(input.value);
        const currentDateString = currentValue.isValid() ? currentValue.format("YYYY-MM-DD") : moment().format("YYYY-MM-DD");
        const newDate = moment(`${currentDateString} ${newTimeValue}`);
        onChange(moment(newDate).toDate());
    };

    const momentValue = input.value && moment(input.value).isValid() ? moment(input.value) : null;
    const dateStringValue: string = momentValue?.isValid() ? momentValue.format("YYYY-MM-DD") : "";
    const timeStringValue: string | null = momentValue?.isValid() ? momentValue.format("HH:mm") : null;

    const rootClasses: string[] = [classes.root];
    if (disabled) rootClasses.push(classes.disabled);
    if (fullWidth) rootClasses.push(classes.fullWidth);

    return (
        <div className={rootClasses.join(" ")}>
            <FormControl classes={{ root: classes.date }}>
                {dateInputLabel && <FormLabel disabled={disabled}>{dateInputLabel}</FormLabel>}
                <FinalFormDatePicker
                    input={{ ...otherInput, onChange: onDateChange, value: dateStringValue }}
                    meta={meta}
                    disabled={disabled}
                    fullWidth
                    {...datePickerProps}
                />
            </FormControl>
            <FormControl classes={{ root: classes.time }}>
                {dateInputLabel && <FormLabel disabled={disabled}>{timeInputLabel}</FormLabel>}
                <FinalFormTimePicker
                    input={{ ...otherInput, onChange: onTimeChange, value: timeStringValue }}
                    meta={meta}
                    disabled={disabled}
                    fullWidth
                    {...timePickerProps}
                />
            </FormControl>
        </div>
    );
};

export const FinalFormDateTimePicker = withStyles(styles, { name: "CometAdminDateTimePicker" })(DateTime);
