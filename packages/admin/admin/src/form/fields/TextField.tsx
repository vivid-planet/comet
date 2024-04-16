import * as React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormInput } from "../FinalFormInput";

export type TextFieldProps = FieldProps<string, HTMLInputElement>;

export const TextField = (props: TextFieldProps): React.ReactElement => {
    return <Field component={FinalFormInput} {...props} />;
};
