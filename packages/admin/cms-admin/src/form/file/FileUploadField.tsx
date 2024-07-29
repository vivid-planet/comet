import { Field, FieldProps } from "@comet/admin";
import React from "react";

import { FinalFormFileUpload, FinalFormFileUploadProps } from "./FinalFormFileUpload";
import { GQLFinalFormFileUploadFragment } from "./FinalFormFileUpload.generated";

export type FileUploadFieldProps<MaxFiles> = (MaxFiles extends 1
    ? { maxFiles?: MaxFiles } & FieldProps<GQLFinalFormFileUploadFragment, HTMLInputElement>
    : { maxFiles?: MaxFiles } & FieldProps<GQLFinalFormFileUploadFragment[], HTMLInputElement>) &
    Partial<FinalFormFileUploadProps<MaxFiles>>;

type FieldValue<MaxFiles extends number | undefined> = MaxFiles extends 1 ? GQLFinalFormFileUploadFragment : GQLFinalFormFileUploadFragment[];

export const FileUploadField = <MaxFiles extends number | undefined>({ name, ...restProps }: FileUploadFieldProps<MaxFiles>) => {
    return <Field<FieldValue<MaxFiles>> component={FinalFormFileUpload} name={name} {...restProps} />;
};
