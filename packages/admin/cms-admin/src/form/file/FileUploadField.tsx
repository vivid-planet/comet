import { Field, type FieldProps } from "@comet/admin";

import { FinalFormFileUpload, type FinalFormFileUploadProps } from "./FinalFormFileUpload";
import { type GQLFinalFormFileUploadDownloadableFragment, type GQLFinalFormFileUploadFragment } from "./FinalFormFileUpload.generated";

type SingleFileUploadProps<Multiple extends boolean | undefined> = FieldProps<
    GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment,
    HTMLInputElement
> &
    Partial<FinalFormFileUploadProps<Multiple>> & {
        multiple?: false;
        maxFiles?: 1;
    };

type MultipleFileUploadProps<Multiple extends boolean | undefined> = FieldProps<
    Array<GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment>,
    HTMLInputElement
> &
    Partial<FinalFormFileUploadProps<Multiple>> & {
        multiple: true;
        maxFiles?: number;
    };

export type FileUploadFieldProps<Multiple extends boolean | undefined> = Multiple extends true
    ? MultipleFileUploadProps<Multiple>
    : SingleFileUploadProps<Multiple>;

export const FileUploadField = <Multiple extends boolean | undefined>({ name, ...restProps }: FileUploadFieldProps<Multiple>) => {
    return (
        <Field<
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
