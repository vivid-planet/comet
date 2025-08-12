import { Field, type FieldProps } from "@comet/admin";

import { FinalFormFileUpload, type FinalFormFileUploadProps } from "./FinalFormFileUpload";
import { type GQLFinalFormFileUploadDownloadableFragment, type GQLFinalFormFileUploadFragment } from "./FinalFormFileUpload.generated";

type SingleFileUploadProps<FormValues> = FieldProps<
    FormValues,
    GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment,
    HTMLInputElement
> &
    Partial<FinalFormFileUploadProps<false>> & {
        multiple?: false;
        maxFiles?: 1;
    };

type MultipleFileUploadProps<FormValues> = FieldProps<
    FormValues,
    Array<GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment>,
    HTMLInputElement
> &
    Partial<FinalFormFileUploadProps<true>> & {
        multiple: true;
        maxFiles?: number;
    };

export type FileUploadFieldProps<FormValues, Multiple extends boolean | undefined> = Multiple extends true
    ? MultipleFileUploadProps<FormValues>
    : SingleFileUploadProps<FormValues>;

export const FileUploadField = <FormValues, Multiple extends boolean | undefined>({
    name,
    ...restProps
}: FileUploadFieldProps<FormValues, Multiple>) => {
    return (
        <Field<
            FormValues,
            Multiple extends true
                ? Array<GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment>
                : GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment
        >
            component={FinalFormFileUpload}
            name={name}
            {...restProps}
        />
    );
};
