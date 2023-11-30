import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { ClearInputAdornment, InputWithPopperProps } from "@comet/admin";
import { Calendar as CalendarIcon } from "@comet/admin-icons";
import { ComponentsOverrides } from "@mui/material";
import { Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";
import { FormatDateOptions, useIntl } from "react-intl";

import { Calendar, DatePickerClassKey, Root, SlotProps, StartAdornment } from "./DatePicker.slots";
import { DatePickerNavigation } from "./DatePickerNavigation";
import { useDateFnsLocale } from "./helpers/DateFnsLocaleProvider";
import { defaultMaxDate, defaultMinDate } from "./helpers/datePickerHelpers";

export interface DatePickerProps extends Omit<InputWithPopperProps, "children" | "value" | "onChange" | "slotProps"> {
    onChange?: (date?: Date) => void;
    value?: Date;
    formatDateOptions?: FormatDateOptions;
    clearable?: boolean;
    monthsToShow?: number;
    maxDate?: Date;
    minDate?: Date;
    slotProps?: SlotProps;
}

export const DatePicker = (inProps: DatePickerProps) => {
    const {
        onChange,
        value,
        formatDateOptions,
        endAdornment,
        clearable,
        placeholder,
        monthsToShow,
        minDate = defaultMinDate,
        maxDate = defaultMaxDate,
        slotProps,
        ...inputWithPopperProps
    } = useThemeProps({ props: inProps, name: "CometAdminDatePicker" });
    const intl = useIntl();
    const dateFnsLocale = useDateFnsLocale();

    return (
        <Root
            value={value ? intl.formatDate(value, formatDateOptions) : ""}
            startAdornment={
                <StartAdornment position="start" disablePointerEvents {...slotProps?.startAdornment}>
                    <CalendarIcon />
                </StartAdornment>
            }
            placeholder={placeholder ?? intl.formatMessage({ id: "comet.datePicker.selectDate", defaultMessage: "Select date" })}
            {...inputWithPopperProps}
            {...slotProps?.root}
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
                    {...slotProps?.calendar}
                />
            )}
        </Root>
    );
};

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
