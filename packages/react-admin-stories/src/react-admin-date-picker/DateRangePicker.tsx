import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";
import { DateRangePicker as AirBNBDateRangePicker } from "react-dates";
import * as sc from "./Picker.sc";

const Story = () => {
    moment.locale("de");
    const [focusedInputField, setFocusedInputField] = React.useState<"startDate" | "endDate" | null>(null);
    const [pickedStartDate, setPickedStartDate] = React.useState<moment.Moment | null>(moment());
    const [pickedEndDate, setPickedEndDate] = React.useState<moment.Moment | null>(null);

    return (
        <sc.DateRangePickerWrapper>
            <AirBNBDateRangePicker
                startDate={pickedStartDate}
                startDatePlaceholderText={String(moment().format("L"))}
                startDateId="start_date"
                endDate={pickedEndDate}
                endDatePlaceholderText=""
                endDateId="end_date"
                onDatesChange={({ startDate, endDate }) => {
                    setPickedStartDate(startDate);
                    setPickedEndDate(endDate);
                }}
                focusedInput={focusedInputField}
                onFocusChange={setFocusedInputField}
                small
                hideKeyboardShortcutsPanel
                isOutsideRange={() => false}
                minimumNights={0}
                showClearDates
                showDefaultInputIcon
                inputIconPosition="after"
            />
        </sc.DateRangePickerWrapper>
    );
};

storiesOf("react-admin-date-picker", module).add("Date Range Picker", () => <Story />);
