import { useLocaleName } from "@vivid-planet/react-admin-date-fns";
import * as moment from "moment";
import * as React from "react";
import { SingleDatePicker as AirBNBDatePicker } from "react-dates";
import { FieldRenderProps } from "react-final-form";
import * as sc from "./DatePicker.sc";

interface IProps extends FieldRenderProps<string | Date, HTMLInputElement> {
    fullWidth?: boolean;
    color?: "primary" | "secondary" | "default";
}

export const DatePicker: React.FC<IProps> = ({
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
    const [focused, setFocus] = React.useState<boolean>(false);
    const selectedDate = value ? moment(value) : null;

    React.useEffect(() => {
        moment.locale(localeName);
    }, [localeName]);

    return (
        <sc.SingleDatePickerWrapper fullWidth={fullWidth} color={color}>
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
                {...props}
            />
        </sc.SingleDatePickerWrapper>
    );
};
