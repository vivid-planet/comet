import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";
import { SingleDatePicker as AirBNBDatePicker } from "react-dates";
import { setMomentLocale } from "./moment";
import * as sc from "./Picker.sc";

const Story = () => {
    const locale = setMomentLocale();
    const [focusedField, setFocus] = React.useState<boolean | null>(false);
    const [pickedDate, setPickedDate] = React.useState<moment.Moment | null>(locale);

    return (
        <sc.SingleDatePickerWrapper>
            <AirBNBDatePicker
                date={pickedDate}
                id="single_date_picker"
                onDateChange={date => {
                    setPickedDate(date);
                }}
                focused={focusedField ? focusedField : false}
                onFocusChange={({ focused }) => {
                    setFocus(focused);
                }}
                small
                hideKeyboardShortcutsPanel
                isOutsideRange={() => false}
                showClearDate
                numberOfMonths={1}
                showDefaultInputIcon
                inputIconPosition="after"
            />
        </sc.SingleDatePickerWrapper>
    );
};

storiesOf("react-admin-date-picker", module).add("Single Date Picker", () => <Story />);
