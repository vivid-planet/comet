import * as moment from "moment";
import * as React from "react";
import { SingleDatePicker as AirBNBDatePicker } from "react-dates";
import { FieldRenderProps } from "react-final-form";
import * as sc from "./SingleDatePicker.sc";

interface IProps extends FieldRenderProps<string | Date, HTMLInputElement> {
    width?: string;
}

const SingleDatePicker: React.FunctionComponent<IProps> = props => {
    moment.locale("de");
    const [focused, setFocus] = React.useState();
    const selectedDate = props.input.value ? moment(props.input.value) : moment();

    return (
        <sc.SingleDatePickerWrapper>
            <AirBNBDatePicker
                date={selectedDate}
                id="single_date_picker"
                onDateChange={(date: moment.Moment) => {
                    props.input.onChange(date ? date.toDate() : null);
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
            />
        </sc.SingleDatePickerWrapper>
    );
};

export default SingleDatePicker;
