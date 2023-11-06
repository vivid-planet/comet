import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { ClearInputAdornment, InputWithPopper, InputWithPopperProps } from "@comet/admin";
import { Calendar as CalendarIcon } from "@comet/admin-icons";
import { ComponentsOverrides, InputAdornment } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { Calendar, CalendarProps } from "react-date-range";
import { FormatDateOptions, useIntl } from "react-intl";

import { DatePickerClassKey, styles } from "./DatePicker.styles";
import { DatePickerNavigation } from "./DatePickerNavigation";
import { useDateFnsLocale } from "./helpers/DateFnsLocaleProvider";
import { defaultMaxDate, defaultMinDate } from "./helpers/datePickerHelpers";

type DatePickerComponentsProps = InputWithPopperProps["componentsProps"] & {
    calendar?: Partial<Omit<CalendarProps, "onChange" | "date">>;
};

export interface DatePickerProps extends Omit<InputWithPopperProps, "children" | "value" | "onChange" | "componentsProps"> {
    onChange?: (date?: Date) => void;
    value?: Date;
    formatDateOptions?: FormatDateOptions;
    componentsProps?: DatePickerComponentsProps;
    clearable?: boolean;
    monthsToShow?: number;
    maxDate?: Date;
    minDate?: Date;
}

function DatePicker({
    classes,
    onChange,
    value,
    componentsProps = {},
    formatDateOptions,
    endAdornment,
    clearable,
    placeholder,
    monthsToShow,
    minDate = defaultMinDate,
    maxDate = defaultMaxDate,
    ...inputWithPopperProps
}: DatePickerProps & WithStyles<typeof styles>): React.ReactElement {
    const { calendar: calendarClass, ...inputWithPopperClasses } = classes;
    const { calendar: calendarProps, ...inputWithPopperComponentsProps } = componentsProps;
    const intl = useIntl();
    const dateFnsLocale = useDateFnsLocale();

    return (
        <InputWithPopper
            classes={inputWithPopperClasses}
            value={value ? intl.formatDate(value, formatDateOptions) : ""}
            startAdornment={
                <InputAdornment position="start" disablePointerEvents>
                    <CalendarIcon />
                </InputAdornment>
            }
            placeholder={placeholder ?? intl.formatMessage({ id: "comet.datePicker.selectDate", defaultMessage: "Select date" })}
            {...inputWithPopperProps}
            componentsProps={inputWithPopperComponentsProps}
            readOnly
            endAdornment={
                clearable ? (
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
                <Calendar
                    className={calendarClass}
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

const DatePickerWithStyles = withStyles(styles, { name: "CometAdminDatePicker" })(DatePicker);

export { DatePickerWithStyles as DatePicker };

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminDatePicker: DatePickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminDatePicker: Partial<DatePickerProps>;
    }

    interface Components {
        CometAdminDatePicker?: {
            defaultProps?: ComponentsPropsList["CometAdminDatePicker"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDatePicker"];
        };
    }
}
