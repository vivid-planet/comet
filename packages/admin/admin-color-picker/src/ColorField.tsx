import { Field, FieldProps } from "@comet/admin";
import * as React from "react";

import { FinalFormColorPicker } from "./FinalFormColorPicker";

export type ColorFieldProps = FieldProps<string, HTMLInputElement>;

export const ColorField = ({ ...restProps }: ColorFieldProps): React.ReactElement => {
    return <Field component={FinalFormColorPicker} {...restProps} />;
};
