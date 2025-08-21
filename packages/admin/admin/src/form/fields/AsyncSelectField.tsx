import { Field, type FieldProps } from "../Field";
import { FinalFormAsyncSelect, type FinalFormAsyncSelectProps } from "../FinalFormAsyncSelect";

export type AsyncSelectFieldProps<Option> = FieldProps<Option, HTMLSelectElement> & FinalFormAsyncSelectProps<Option>;

export function AsyncSelectField<Option>(props: AsyncSelectFieldProps<Option>) {
    return <Field component={FinalFormAsyncSelect} {...props} />;
}
