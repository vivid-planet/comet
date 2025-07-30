import { Field, type FieldProps } from "@comet/admin";

import { FinalFormFileUpload, type FinalFormFileUploadProps } from "./FinalFormFileUpload";
import { type GQLFinalFormFileUploadDownloadableFragment, type GQLFinalFormFileUploadFragment } from "./FinalFormFileUpload.generated";

type SingleFileUploadProps = FieldProps<GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment, HTMLInputElement> &
    Partial<FinalFormFileUploadProps<false>> & {
        multiple?: false;
        maxFiles?: 1;
    };

type MultipleFileUploadProps = FieldProps<Array<GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment>, HTMLInputElement> &
    Partial<FinalFormFileUploadProps<true>> & {
        multiple: true;
        maxFiles?: number;
    };

export type FileUploadFieldProps<Multiple extends boolean | undefined> = Multiple extends true ? MultipleFileUploadProps : SingleFileUploadProps;

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
