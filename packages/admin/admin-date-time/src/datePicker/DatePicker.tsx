import { Calendar as CalendarIcon } from "@comet/admin-icons";
import { type ComponentsOverrides } from "@mui/material";
import { type Theme, useThemeProps } from "@mui/material/styles";
import { DatePicker as MuiDatePicker, type DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers";
import { type FormatDateOptions } from "react-intl";

import { defaultMaxDate, defaultMinDate } from "../utils/datePickerHelpers";

/**
 * TODO
 * - Remove prop-dependency on InputWithPopperProps
 * - Is `monthsToShow` still possible?
 */

type DatePickerClassKey = "root";

export interface DatePickerProps extends MuiDatePickerProps<Date, false> {
    // onChange?: (date?: string) => void;
    // value?: string;
    formatDateOptions?: FormatDateOptions;
    required?: boolean;
    disabled?: boolean; // TODO: New prop
    // monthsToShow?: number;
    maxDate?: Date;
    minDate?: Date;
}

export const DatePicker = (inProps: DatePickerProps) => {
    const {
        value,
        disabled,
        minDate = defaultMinDate,
        maxDate = defaultMaxDate,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminDatePicker" });
    const dateValue = value ? new Date(value) : undefined;

    return (
        <MuiDatePicker
            value={dateValue}
            disabled={disabled}
            // onChange={(newValue: Date | null) => {
            //     // TODO: Do we need to implement this??
            //     // setInternalValue(newValue);
            // }}
            // onAccept={(newValue: Date | null) => {
            //     // TODO: Do we need to implement this??
            //     // applyDateValue(newValue);
            // }}
            showDaysOutsideCurrentMonth // TODO: Should this be a default-value from the theme?
            minDate={minDate}
            maxDate={maxDate}
            slotProps={{
                textField: {
                    variant: "standard",
                    size: "small",
                    fullWidth: true,
                    InputProps: {
                        disableUnderline: true,
                    },
                    onBlur: () => {
                        // TODO: Do we need to implement this??
                        // applyDateValue(internalValue);
                    },
                },
            }}
            slots={{
                openPickerIcon: CalendarIcon,
                // clearButton: () => {
                //     // TODO: Can we get this to work?
                //     // console.log("### clearButton");
                //     // return <ClearInputAdornment onClick={() => onChange?.(undefined)} hasClearableContent={Boolean(value)} position="end" />;
                // },
            }}
            {...restProps}
        />
    );
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminDatePicker: DatePickerClassKey;
    }

    interface ComponentsPropsList {
        CometAdminDatePicker: DatePickerProps;
    }

    interface Components {
        CometAdminDatePicker?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminDatePicker"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminDatePicker"];
        };
    }
}
