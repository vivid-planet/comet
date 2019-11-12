import { InputBaseProps } from "@material-ui/core/InputBase";
import * as moment from "moment";
import * as React from "react";
import { DateRangePicker as AirBNBDateRangePicker } from "react-dates";
import { FieldRenderProps } from "react-final-form";
import * as sc from "./DateRangePicker.sc";

interface IDateRange {
    start: Date | null;
    end: Date | null;
}

interface IDateRangePickerProps extends FieldRenderProps<IDateRange, HTMLElement> {
    isClearable?: boolean;
}

const DateRangePicker: React.FunctionComponent<IDateRangePickerProps & InputBaseProps> = ({ meta, input, innerRef, ...props }) => {
    moment.locale("de");
    const [focusedInputField, setFocusedInputField] = React.useState<"startDate" | "endDate" | null>(null);
    const start = input.value.start ? moment(input.value.start) : moment();
    const end = input.value.end ? moment(input.value.end) : null;

    return (
        <sc.DateRangePickerWrapper>
            <AirBNBDateRangePicker
                startDate={start}
                startDatePlaceholderText={String(moment().format("L"))}
                startDateId="start_date_id"
                endDate={end}
                endDatePlaceholderText=""
                endDateId="end_date_id"
                onDatesChange={({ startDate, endDate }: { startDate: moment.Moment | null; endDate: moment.Moment | null }) => {
                    input.onChange({ start: startDate ? startDate.toDate() : null, end: endDate ? endDate.toDate() : null });
                }}
                focusedInput={focusedInputField}
                onFocusChange={setFocusedInputField}
                small
                hideKeyboardShortcutsPanel
                isOutsideRange={() => false}
                minimumNights={0}
                showClearDates={props.isClearable}
            />
        </sc.DateRangePickerWrapper>
    );
};

export default DateRangePicker;
