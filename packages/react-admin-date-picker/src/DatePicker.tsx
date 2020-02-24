import * as moment from "moment";
import * as React from "react";
import { SingleDatePicker as AirBNBDatePicker } from "react-dates";
import { FieldRenderProps } from "react-final-form";
import * as sc from "./DatePicker.sc";
import { useLocaleName } from "@vivid-planet/react-admin-date-fns";

export const DatePicker: React.FunctionComponent<FieldRenderProps<string | Date, HTMLInputElement>> = ({
    input: { value, onChange, ...restInput },
    meta,
    ...props
}) => {
    const localeName = useLocaleName();
    const locale = moment().locale(localeName);
    const [focused, setFocus] = React.useState();
    const selectedDate = value ? moment(value) : null;

    return (
        <sc.SingleDatePickerWrapper>
            <AirBNBDatePicker
                date={selectedDate}
                id="single_date_picker"
                onDateChange={(date: moment.Moment) => {
                    onChange(date ? date.toDate() : null);
                }}
                placeholder={String(locale.format("L"))}
                focused={focused}
                onFocusChange={() => (focused ? setFocus(false) : setFocus(true))}
                small
                hideKeyboardShortcutsPanel
                isOutsideRange={() => false}
                numberOfMonths={1}
                displayFormat={() => locale.localeData().longDateFormat("L")}
                {...restInput}
                {...props}
            />
        </sc.SingleDatePickerWrapper>
    );
};
