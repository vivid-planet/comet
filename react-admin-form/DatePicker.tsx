// tslint:disable:no-submodule-imports
import * as de from "date-fns/locale/de";
import * as React from "react";
import DatePickerOrig, { ReactDatePickerProps, registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FieldRenderProps } from "react-final-form";

registerLocale("de", de);

interface IProps extends FieldRenderProps, ReactDatePickerProps {}
const DatePicker: React.FunctionComponent<IProps> = ({ input: { value, ...restInput }, meta, ...rest }) => {
    return <DatePickerOrig locale="de" selected={value ? new Date(value) : null} {...restInput} {...rest} />;
};

export default DatePicker;
