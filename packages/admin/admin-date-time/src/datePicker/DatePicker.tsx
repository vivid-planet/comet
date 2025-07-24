import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { ClearInputAdornment, type InputWithPopperProps } from "@comet/admin";
import { Calendar as CalendarIcon } from "@comet/admin-icons";
import { type ComponentsOverrides } from "@mui/material";
import { type Theme, useThemeProps } from "@mui/material/styles";
import { type FormatDateOptions, useIntl } from "react-intl";

import { DatePickerNavigation } from "../DatePickerNavigation";
import { useDateFnsLocale } from "../utils/DateFnsLocaleProvider";
import { defaultMaxDate, defaultMinDate, getIsoDateString } from "../utils/datePickerHelpers";
import { Calendar, type DatePickerClassKey, Root, type SlotProps, StartAdornment } from "./DatePicker.slots";

export interface DatePickerProps extends Omit<InputWithPopperProps, "children" | "value" | "onChange" | "slotProps"> {
    onChange?: (date?: string) => void;
    value?: string;
    formatDateOptions?: FormatDateOptions;
    required?: boolean;
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
        required,
        placeholder,
        monthsToShow,
        minDate = defaultMinDate,
        maxDate = defaultMaxDate,
        slotProps,
        endAdornment,
        ...inputWithPopperProps
    } = useThemeProps({ props: inProps, name: "CometAdminDTDatePicker" });
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

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminDTDatePicker: DatePickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminDTDatePicker: DatePickerProps;
    }

    interface Components {
        CometAdminDTDatePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDTDatePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDTDatePicker"];
        };
    }
}
