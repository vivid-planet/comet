import { useLocaleName } from "@vivid-planet/comet-admin";
import * as moment from "moment";
import * as React from "react";
import { SingleDatePicker as AirBNBDatePicker } from "react-dates";
import { FieldRenderProps } from "react-final-form";

import * as sc from "./DatePicker.sc";
import useUniqueId from "./useUniqueId";

interface IProps extends FieldRenderProps<string | Date, HTMLInputElement> {
    fullWidth?: boolean;
    color?: "primary" | "secondary" | "default";
    placeholder?: string;
}

export const FinalFormDatePicker: React.FC<IProps> = ({
    input: { value, onChange, name },
    fullWidth = false,
    color = "default",
    meta,
    label,
    children,
    render,
    placeholder,
    ...props
}) => {
    const localeName = useLocaleName();
    const locale = moment().locale(localeName);
    const [focused, setFocus] = React.useState<boolean>(false);
    const selectedDate = value ? moment(value) : null;
    const datePickerUniqueId = useUniqueId();

    React.useEffect(() => {
        moment.locale(localeName);
    }, [localeName]);

    return (
        <sc.SingleDatePickerWrapper fullWidth={fullWidth} color={color}>
            <AirBNBDatePicker
                date={selectedDate}
                id={`date-picker-${name}-${datePickerUniqueId}`}
                onDateChange={(date: moment.Moment) => {
                    onChange(date ? date.toDate() : null);
                }}
                placeholder={placeholder === undefined ? String(locale.format("L")) : placeholder}
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
