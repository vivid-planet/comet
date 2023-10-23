import { Field, FieldProps } from "@comet/admin";
import * as React from "react";

import { FinalFormDatePicker } from "../FinalFormDatePicker";

export type DateFieldProps = FieldProps<Date, HTMLInputElement>;

export const DateField = ({ ...restProps }: DateFieldProps): React.ReactElement => {
    return <Field component={FinalFormDatePicker} {...restProps} />;
};
