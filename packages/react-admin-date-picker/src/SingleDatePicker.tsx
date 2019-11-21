import { LocaleContext } from "@vivid-planet/react-admin-date-fns";
import * as moment from "moment";
import * as React from "react";
import { SingleDatePicker as AirBNBDatePicker } from "react-dates";
import { FieldRenderProps } from "react-final-form";
import * as sc from "./SingleDatePicker.sc";

interface IProps extends FieldRenderProps<string | Date, HTMLInputElement> {
    colorSelected?: string;
    colorHover?: string;
    colorHoverSelected?: string;
}

export const SingleDatePicker: React.FunctionComponent<IProps> = ({ input: { value, onChange, ...restInput }, meta, ...props }) => {
    const localeContext = React.useContext(LocaleContext);
    const locale = moment().locale(localeContext.localeName ? localeContext.localeName : "de");
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
