import { Field, type FieldProps } from "@comet/admin";

import { FinalFormFileField, type FinalFormFileFieldProps, type GQLDamFileFieldFileFragment } from "./FinalFormFileField";

export type { GQLDamFileFieldFileFragment } from "./FinalFormFileField";

export type FileFieldProps = FieldProps<GQLDamFileFieldFileFragment | undefined, HTMLInputElement> & FinalFormFileFieldProps;

export const FileField = ({ name, ...restProps }: FileFieldProps) => {
    return <Field component={FinalFormFileField} name={name} {...restProps} />;
};
