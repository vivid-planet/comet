import { useLocaleName } from "@vivid-planet/react-admin-date-fns";
import * as moment from "moment";
import * as React from "react";
import { DateRangePicker as AirBNBDateRangePicker } from "react-dates";
import { FieldRenderProps } from "react-final-form";
import * as sc from "./DateRangePicker.sc";

interface IDateRange {
    start: Date | null;
    end: Date | null;
}

interface IProps extends FieldRenderProps<IDateRange, HTMLInputElement> {
    fullWidth?: boolean;
    color?: "primary" | "secondary" | "default";
}

export const DateRangePicker: React.FC<IProps> = ({
    input: { value, onChange },
    fullWidth = false,
    color = "default",
    meta,
    label,
    name,
    children,
    render,
    ...props
}) => {
    const localeName = useLocaleName();
    const locale = moment().locale(localeName);
    const [focusedInputField, setFocusedInputField] = React.useState<"startDate" | "endDate" | null>(null);
    const start = value.start ? moment(value.start) : null;
    const end = value.end ? moment(value.end) : null;

    React.useEffect(() => {
        moment.locale(localeName);
    }, [localeName]);

    return (
        <sc.DateRangePickerWrapper fullWidth={fullWidth} color={color}>
            <AirBNBDateRangePicker
                startDate={start}
                startDatePlaceholderText={String(locale.format("L"))}
                startDateId="start_date_id"
                endDate={end}
                endDatePlaceholderText={String(locale.format("L"))}
                endDateId="end_date_id"
                onDatesChange={({ startDate, endDate }: { startDate: moment.Moment | null; endDate: moment.Moment | null }) => {
                    onChange({ start: startDate ? startDate.toDate() : null, end: endDate ? endDate.toDate() : null });
                }}
                focusedInput={focusedInputField}
                onFocusChange={setFocusedInputField}
                small
                hideKeyboardShortcutsPanel
                isOutsideRange={() => false}
                minimumNights={0}
                displayFormat={() => locale.localeData().longDateFormat("L")}
                {...props}
            />
        </sc.DateRangePickerWrapper>
    );
};
