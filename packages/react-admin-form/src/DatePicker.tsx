import { format } from "date-fns";
import * as de from "date-fns/locale/de";
import * as React from "react";
import DatePickerOrig, { ReactDatePickerProps, registerLocale } from "react-datepicker";
// tslint:disable-next-line:no-submodule-imports
import "react-datepicker/dist/react-datepicker.css";
import { FieldRenderProps } from "react-final-form";
import * as sc from "./DatePicker.sc";
import { StyledInput } from "./Input";

registerLocale("de", de);

const onChangeAdapter = (origOnChange: <T>(event: React.ChangeEvent<T> | any) => void, showTimeSelect: boolean, date?: Date) => {
    origOnChange(date && format(date, showTimeSelect ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd"));
};

interface IProps extends FieldRenderProps, ReactDatePickerProps {
    width?: string;
}
export const DatePicker: React.FunctionComponent<IProps> = ({ input: { value, onChange, ...restInput }, meta, width, ...rest }) => {
    const inputProps = {
        style: {
            width,
        },
    };
    return (
        <sc.DatePickerRoot>
            <DatePickerOrig
                locale="de"
                selected={value ? new Date(value) : null}
                onChange={onChangeAdapter.bind(this, onChange, !!rest.showTimeSelect)}
                customInput={<StyledInput type="text" {...inputProps} />}
                {...restInput}
                {...rest}
            />
        </sc.DatePickerRoot>
    );
};
