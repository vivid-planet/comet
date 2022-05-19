import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { InputWithPopper, InputWithPopperProps } from "@comet/admin";
import * as React from "react";
import { DateRange as ReactDateRange, DateRangeProps as ReactDateRangeProps, Range } from "react-date-range";
import { FormatDateOptions, useIntl } from "react-intl";

type DateRangePickerComponentsProps = InputWithPopperProps["componentsProps"] & {
    dateRange?: Partial<Omit<ReactDateRangeProps, "onChange" | "ranges">>;
};

export type DateRange = {
    start: Date;
    end: Date;
};

export interface DateRangePickerProps extends Omit<InputWithPopperProps, "children" | "value" | "onChange" | "componentsProps"> {
    onChange?: (range: DateRange) => void;
    value?: DateRange;
    formatDateOptions?: FormatDateOptions;
    rangeStringSeparator?: string;
    componentsProps?: DateRangePickerComponentsProps;
}

const useDateRangeTextValue = (range: DateRange | null | undefined, rangeStringSeparator: string, formatDateOptions?: FormatDateOptions): string => {
    const intl = useIntl();

    if (range) {
        const startDateString = intl.formatDate(range.start, formatDateOptions);
        const endDateString = intl.formatDate(range.end, formatDateOptions);

        if (startDateString === endDateString) {
            return startDateString;
        }

        return `${startDateString}${rangeStringSeparator}${endDateString}`;
    }

    return "";
};

const rangeKey = "pickedDateRange";

const getRangeFromValue = (value: undefined | DateRange): Range => {
    if (value?.start) {
        return {
            key: rangeKey,
            startDate: value.start,
            endDate: value.end ?? value.start,
        };
    }

    // The range-picker from react-date-range always requires at least one valid date range to prevent every date from being highlighted as selected.
    // If no `value` is defined, this returns the current date as the selected range.
    // This range is only for visual purposes and will never be passed to a change event.
    return {
        key: rangeKey,
        startDate: new Date(),
        endDate: new Date(),
    };
};

export function DateRangePicker({
    onChange,
    value,
    componentsProps = {},
    formatDateOptions,
    rangeStringSeparator = " - ",
    ...inputWithPopperProps
}: DateRangePickerProps): React.ReactElement {
    const { dateRange: dateRangeProps, ...inputWithPopperComponentsProps } = componentsProps;
    const textValue = useDateRangeTextValue(value, rangeStringSeparator, formatDateOptions);

    return (
        <InputWithPopper value={textValue} {...inputWithPopperProps} componentsProps={inputWithPopperComponentsProps} readOnly>
            {(closePopper) => (
                <ReactDateRange
                    onRangeFocusChange={(newFocusedRange) => {
                        const rangeSelectionHasCompleted = newFocusedRange[0] === 0 && newFocusedRange[1] === 0;
                        if (rangeSelectionHasCompleted) {
                            closePopper(true);
                        }
                    }}
                    ranges={[getRangeFromValue(value)]}
                    onChange={(ranges) => {
                        const pickedRange = ranges[rangeKey];
                        if (pickedRange.startDate && pickedRange.endDate) {
                            onChange &&
                                onChange({
                                    start: pickedRange.startDate,
                                    end: pickedRange.endDate,
                                });
                        }
                    }}
                    showDateDisplay={false}
                    {...dateRangeProps}
                />
            )}
        </InputWithPopper>
    );
}
