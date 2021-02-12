import { DatePickerThemeProps } from "./core/DatePicker";
import { CometAdminDatePickerClassKeys } from "./core/DatePicker.styles";
import { DateRangePickerThemeProps } from "./core/DateRangePicker";
import { CometAdminDateRangePickerClassKeys } from "./core/DateRangePicker.styles";
import { DateTimePickerProps } from "./core/DateTimePicker";
import { CometAdminDateTimePickerClassKeys } from "./core/DateTimePicker.styles";
import { TimePickerProps } from "./core/TimePicker";
import { CometAdminTimePickerClassKeys } from "./core/TimePicker.styles";

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminDatePicker: CometAdminDatePickerClassKeys;
        CometAdminDateRangePicker: CometAdminDateRangePickerClassKeys;
        CometAdminTimePicker: CometAdminTimePickerClassKeys;
        CometAdminDateTimePicker: CometAdminDateTimePickerClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminDatePicker: DatePickerThemeProps;
        CometAdminDateRangePicker: DateRangePickerThemeProps;
        CometAdminTimePicker: TimePickerProps;
        CometAdminDateTimePicker: DateTimePickerProps;
    }
}
