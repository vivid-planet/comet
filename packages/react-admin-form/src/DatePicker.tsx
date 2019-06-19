import { format, isValid, parse, parseISO } from "date-fns";
import * as de from "date-fns/locale/de";
import * as React from "react";
import DatePickerOrig, { ReactDatePickerProps, registerLocale } from "react-datepicker";
// tslint:disable-next-line:no-submodule-imports
import "react-datepicker/dist/react-datepicker.css";
import { FieldRenderProps } from "react-final-form";
import * as sc from "./DatePicker.sc";
import { StyledInput } from "./Input";

registerLocale("de", de);

const onChangeAdapter = (origOnChange: <T>(event: React.ChangeEvent<T> | any) => void, valueFormat: string, date?: Date) => {
    origOnChange(date && format(date, valueFormat));
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
    const valueFormat = rest.showTimeSelect ? "yyyy-MM-dd HH:mm:ss" : "yyyy-MM-dd";

    let parsedValue: Date | null = value;
    if (parsedValue) {
        parsedValue = parseISO(value);
        if (!isValid(parsedValue)) {
            parsedValue = parse(value, valueFormat, new Date());
        }
        if (!isValid(parsedValue)) {
            parsedValue = null;
        }
    }
    return (
        <sc.DatePickerRoot>
            <DatePickerOrig
                locale="de"
                selected={parsedValue}
                onChange={onChangeAdapter.bind(this, onChange, valueFormat)}
                customInput={<StyledInput type="text" {...inputProps} />}
                {...restInput}
                {...rest}
            />
        </sc.DatePickerRoot>
    );
};
