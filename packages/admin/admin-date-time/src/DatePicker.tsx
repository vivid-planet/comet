import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { ClearInputAdornment, InputWithPopper, InputWithPopperProps } from "@comet/admin";
import * as React from "react";
import { Calendar, CalendarProps } from "react-date-range";
import { FormatDateOptions, useIntl } from "react-intl";

type DatePickerComponentsProps = InputWithPopperProps["componentsProps"] & {
    calendar?: Partial<Omit<CalendarProps, "onChange" | "date">>;
};

export interface DatePickerProps extends Omit<InputWithPopperProps, "children" | "value" | "onChange" | "componentsProps"> {
    onChange?: (date?: Date) => void;
    value?: Date;
    formatDateOptions?: FormatDateOptions;
    componentsProps?: DatePickerComponentsProps;
    clearable?: boolean;
}

export function DatePicker({
    onChange,
    value,
    componentsProps = {},
    formatDateOptions,
    endAdornment,
    clearable,
    ...inputWithPopperProps
}: DatePickerProps): React.ReactElement {
    const { calendar: calendarProps, ...inputWithPopperComponentsProps } = componentsProps;
    const intl = useIntl();

    return (
        <InputWithPopper
            value={value ? intl.formatDate(value, formatDateOptions) : ""}
            {...inputWithPopperProps}
            componentsProps={inputWithPopperComponentsProps}
            readOnly
            endAdornment={
                <>
                    {clearable && (
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(value)} onClick={() => onChange && onChange(undefined)} />
                    )}
                    {endAdornment}
                </>
            }
        >
            {(closePopper) => (
                <Calendar
                    date={value}
                    onChange={(date) => {
                        closePopper(true);
                        onChange && onChange(date);
                    }}
                    {...calendarProps}
                />
            )}
        </InputWithPopper>
    );
}
