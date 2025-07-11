import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { ClearInputAdornment, type InputWithPopperProps } from "@comet/admin";
import { Calendar as CalendarIcon } from "@comet/admin-icons";
import { useThemeProps } from "@mui/material/styles";
import { type FormatDateOptions, useIntl } from "react-intl";

import { DatePickerNavigation } from "../DatePickerNavigation";
import { useDateFnsLocale } from "../utils/DateFnsLocaleProvider";
import { defaultMaxDate, defaultMinDate, getIsoDateString } from "../utils/datePickerHelpers";
import { Calendar, Root, type SlotProps, StartAdornment } from "./LegacyDatePicker.slots";

export interface LegacyDatePickerProps extends Omit<InputWithPopperProps, "children" | "value" | "onChange" | "slotProps"> {
    onChange?: (date?: string) => void;
    value?: string;
    formatDateOptions?: FormatDateOptions;
    required?: boolean;
    monthsToShow?: number;
    maxDate?: Date;
    minDate?: Date;
    slotProps?: SlotProps;
}

export const LegacyDatePicker = (inProps: LegacyDatePickerProps) => {
    const {
        onChange,
        value,
        formatDateOptions,
        required,
        placeholder,
        monthsToShow,
        minDate = defaultMinDate,
        maxDate = defaultMaxDate,
        slotProps,
        endAdornment,
        ...inputWithPopperProps
    } = useThemeProps({ props: inProps, name: "CometAdminLegacyDatePicker" });
    const intl = useIntl();
    const dateFnsLocale = useDateFnsLocale();
    const dateValue = value ? new Date(value) : undefined;

    return (
        <Root
            value={value ? intl.formatDate(value, formatDateOptions) : ""}
            startAdornment={
                <StartAdornment position="start" disablePointerEvents {...slotProps?.startAdornment}>
                    <CalendarIcon />
                </StartAdornment>
            }
            placeholder={placeholder ?? intl.formatMessage({ id: "comet.datePicker.selectDate", defaultMessage: "Select date" })}
            {...slotProps?.root}
            {...inputWithPopperProps}
            readOnly
            required={required}
            endAdornment={
                !required && !inputWithPopperProps.disabled ? (
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
                    date={dateValue}
                    onChange={(date) => {
                        closePopper(true);
                        onChange?.(getIsoDateString(date));
                    }}
                    {...slotProps?.calendar}
                />
            )}
        </Root>
    );
};
