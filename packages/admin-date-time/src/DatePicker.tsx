import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { InputWithPopper, InputWithPopperProps } from "@comet/admin";
import { FormatDateOptions } from "@formatjs/intl/src/types";
import * as React from "react";
import { Calendar, CalendarProps } from "react-date-range";
import { useIntl } from "react-intl";

type DatePickerComponentsProps = InputWithPopperProps["componentsProps"] & {
    calendar?: Partial<Omit<CalendarProps, "onChange">>;
};

export interface DatePickerProps extends Omit<InputWithPopperProps, "children" | "value" | "onChange" | "componentsProps"> {
    onChange?: CalendarProps["onChange"];
    value?: Date;
    formatDateOptions?: FormatDateOptions;
    componentsProps?: DatePickerComponentsProps;
}

export function DatePicker({
    onChange,
    value,
    componentsProps = {},
    formatDateOptions,
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
