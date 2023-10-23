import * as React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormInput } from "../FinalFormInput";

export type TextAreaFieldProps = FieldProps<string, HTMLTextAreaElement>;

export const TextAreaField = ({ ...restProps }: TextAreaFieldProps): React.ReactElement => {
    return <Field type="textarea" multiline rows={3} component={FinalFormInput} {...restProps} />;
};
