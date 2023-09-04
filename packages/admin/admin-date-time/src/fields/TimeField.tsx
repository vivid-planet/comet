import { Field, FieldProps } from "@comet/admin";
import * as React from "react";

import { FinalFormTimePicker } from "../FinalFormTimePicker";

export type TimeFieldProps = FieldProps<string, HTMLInputElement>;

export const TimeField = ({ ...restProps }: TimeFieldProps): React.ReactElement => {
    return <Field component={FinalFormTimePicker} {...restProps} />;
};
