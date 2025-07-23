import { Field, type FieldProps } from "../Field";
import { FinalFormSearchTextField } from "../FinalFormSearchTextField";

export type SearchFieldProps = FieldProps<string, HTMLInputElement>;

export const SearchField = ({ ...restProps }: SearchFieldProps) => {
    return <Field component={FinalFormSearchTextField} {...restProps} />;
};
