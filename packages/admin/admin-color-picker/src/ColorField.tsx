import { Field, type FieldProps } from "@comet/admin";

import { FinalFormColorPicker } from "./FinalFormColorPicker";

export type ColorFieldProps = FieldProps<string, HTMLInputElement>;

export const ColorField = ({ ...restProps }: ColorFieldProps) => {
    return <Field component={FinalFormColorPicker} {...restProps} />;
};
