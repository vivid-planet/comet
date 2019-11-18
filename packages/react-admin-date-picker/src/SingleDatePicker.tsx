import * as moment from "moment";
import * as React from "react";
import { SingleDatePicker as AirBNBDatePicker } from "react-dates";
import { FieldRenderProps } from "react-final-form";
import { setMomentLocale } from "./moment";
import * as sc from "./SingleDatePicker.sc";

interface IProps extends FieldRenderProps<string | Date, HTMLInputElement> {
    width?: string;
    colorSelected?: string;
    colorHover?: string;
    colorHoverSelected?: string;
    locale?: string;
}

export const SingleDatePicker: React.FunctionComponent<IProps> = ({ input: { value, onChange, ...restInput }, meta, width, ...props }) => {
    const locale = setMomentLocale(props.locale);
    const [focused, setFocus] = React.useState();
    const selectedDate = value ? moment(value) : locale;

    return (
        <sc.SingleDatePickerWrapper>
            <AirBNBDatePicker
                date={selectedDate}
                id="single_date_picker"
                onDateChange={(date: moment.Moment) => {
                    onChange(date ? date.toDate() : null);
                }}
                focused={focused}
                onFocusChange={setFocus}
                small
                hideKeyboardShortcutsPanel
                isOutsideRange={() => false}
                showClearDate
                numberOfMonths={1}
                showDefaultInputIcon
                inputIconPosition="after"
                {...restInput}
                {...props}
            />
        </sc.SingleDatePickerWrapper>
    );
};
