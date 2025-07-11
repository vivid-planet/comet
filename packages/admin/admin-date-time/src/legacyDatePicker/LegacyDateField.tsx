import { Field, type FieldProps } from "@comet/admin";

import { FinalFormLegacyDatePicker } from "./FinalFormLegacyDatePicker";

export type LegacyDateFieldProps = FieldProps<Date, HTMLInputElement>;

export const LegacyDateField = ({ ...restProps }: LegacyDateFieldProps) => {
    return <Field component={FinalFormLegacyDatePicker} {...restProps} />;
};
