import { Field, FieldProps } from "@comet/admin";
import React from "react";

import { FinalFormFileUpload } from "./FinalFormFileUpload";
import { GQLFinalFormFileUploadFragment } from "./FinalFormFileUpload.generated";

type SingleFileUploadProps = FieldProps<GQLFinalFormFileUploadFragment, HTMLInputElement> & {
    multiple?: false;
    maxFiles?: 1;
};

type MultipleFileUploadProps = FieldProps<GQLFinalFormFileUploadFragment[], HTMLInputElement> & {
    multiple: true;
    maxFiles?: number;
};

export type FileUploadFieldProps<Multiple extends boolean | undefined> = Multiple extends true ? MultipleFileUploadProps : SingleFileUploadProps;

export const FileUploadField = <Multiple extends boolean | undefined>({ name, ...restProps }: FileUploadFieldProps<Multiple>) => {
    return (
        <Field<Multiple extends true ? GQLFinalFormFileUploadFragment[] : GQLFinalFormFileUploadFragment>
            component={FinalFormFileUpload}
            name={name}
            {...restProps}
        />
    );
};
