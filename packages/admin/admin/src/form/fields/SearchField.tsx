import { Field, type FieldProps } from "../Field";
import { FinalFormSearchTextField, type FinalFormSearchTextFieldProps } from "../FinalFormSearchTextField";

export type SearchFieldProps = FieldProps<string, HTMLInputElement> & FinalFormSearchTextFieldProps;

export const SearchField = ({ ...restProps }: SearchFieldProps) => {
    return <Field component={FinalFormSearchTextField} {...restProps} />;
};
