import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { ClearInputAdornment, type InputWithPopperProps } from "@comet/admin";
import { Calendar } from "@comet/admin-icons";
import { type ComponentsOverrides } from "@mui/material";
import { type Theme, useThemeProps } from "@mui/material/styles";
import { type Range } from "react-date-range";
import { type FormatDateOptions, useIntl } from "react-intl";

import { DatePickerNavigation } from "../DatePickerNavigation";
import { useDateFnsLocale } from "../utils/DateFnsLocaleProvider";
import { defaultMaxDate, defaultMinDate, getIsoDateString } from "../utils/datePickerHelpers";
import { DateRange, type DateRangePickerClassKey, Root, type SlotProps, StartAdornment } from "./DateRangePicker.slots";

/**
 * @deprecated `DateRange` from `@comet/admin-date-time` will be replaced by `DateRange` from `@comet/admin` in a future major release.
 */
export type DateRange = {
    start: string;
    end: string;
};

export interface DateRangePickerProps extends Omit<InputWithPopperProps, "children" | "value" | "onChange" | "slotProps"> {
    onChange?: (range?: DateRange) => void;
    value?: DateRange;
    formatDateOptions?: FormatDateOptions;
    rangeStringSeparator?: string;
    required?: boolean;
    monthsToShow?: number;
    maxDate?: Date;
    minDate?: Date;
    slotProps?: SlotProps;
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
        const startDate = new Date(value.start);
        return {
            key: rangeKey,
            startDate,
            endDate: value.end ? new Date(value.end) : startDate,
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

/**
 * @deprecated `DateRangePicker` from `@comet/admin-date-time` will be replaced by `DateRangePicker` (currently `Future_DateRangePicker`) from `@comet/admin` in a future major release.
 */
export const DateRangePicker = (inProps: DateRangePickerProps) => {
    const {
        onChange,
        value,
        formatDateOptions,
        rangeStringSeparator = "  —  ",
        endAdornment,
        required,
        placeholder,
        monthsToShow = 2,
        minDate = defaultMinDate,
        maxDate = defaultMaxDate,
        slotProps,
        ...inputWithPopperProps
    } = useThemeProps({ props: inProps, name: "CometAdminLegacyDateRangePicker" });
    const intl = useIntl();
    const textValue = useDateRangeTextValue(value, rangeStringSeparator, formatDateOptions);
    const dateFnsLocale = useDateFnsLocale();

    return (
        <Root
            value={textValue}
            startAdornment={
                <StartAdornment position="start" disablePointerEvents {...slotProps?.startAdornment}>
                    <Calendar />
                </StartAdornment>
            }
            placeholder={placeholder ?? intl.formatMessage({ id: "comet.dateRangePicker.selectDateRange", defaultMessage: "Select date range" })}
            {...slotProps?.root}
            {...inputWithPopperProps}
            readOnly
            required={required}
            endAdornment={
                !required ? (
                    <>
                        <ClearInputAdornment position="end" hasClearableContent={Boolean(value)} onClick={() => onChange && onChange(undefined)} />
                        {endAdornment}
                    </>
                ) : (
                    endAdornment
                )
            }
        >
            {(closePopper) => (
                <DateRange
                    locale={dateFnsLocale}
                    minDate={minDate}
                    maxDate={maxDate}
                    weekStartsOn={1}
                    direction="horizontal"
                    monthDisplayFormat="MMMM yyyy"
                    months={monthsToShow}
                    navigatorRenderer={(focusedDate, changeShownDate) => (
                        <DatePickerNavigation focusedDate={focusedDate} changeShownDate={changeShownDate} minDate={minDate} maxDate={maxDate} />
                    )}
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
                            onChange?.({
                                start: getIsoDateString(pickedRange.startDate),
                                end: getIsoDateString(pickedRange.endDate),
                            });
                        }
                    }}
                    showDateDisplay={false}
                    {...slotProps?.dateRange}
                />
            )}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminLegacyDateRangePicker: DateRangePickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminLegacyDateRangePicker: DateRangePickerProps;
    }

    interface Components {
        CometAdminLegacyDateRangePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminLegacyDateRangePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminLegacyDateRangePicker"];
        };
    }
}
