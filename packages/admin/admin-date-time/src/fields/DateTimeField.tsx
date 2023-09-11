import { Field, FieldProps } from "@comet/admin";
import * as React from "react";

import { FinalFormDateTimePicker } from "../FinalFormDateTimePicker";

export type DateTimeFieldProps = FieldProps<Date, HTMLInputElement>;

export const DateTimeField = ({ ...restProps }: DateTimeFieldProps): React.ReactElement => {
    return <Field component={FinalFormDateTimePicker} {...restProps} />;
};
