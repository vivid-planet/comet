import * as React from "react";

import { Field, FieldProps } from "../Field";
import { FinalFormSearchTextField } from "../FinalFormSearchTextField";

export type SearchFieldProps = FieldProps<string, HTMLInputElement>;

export const SearchField = ({ ...restProps }: SearchFieldProps): React.ReactElement => {
    return <Field component={FinalFormSearchTextField} {...restProps} />;
};
