import { Field, FieldProps } from "@comet/admin";

import { FinalFormFileUpload } from "./FinalFormFileUpload";
import { GQLFinalFormFileUploadDownloadableFragment, GQLFinalFormFileUploadFragment } from "./FinalFormFileUpload.generated";

type SingleFileUploadProps = FieldProps<GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment, HTMLInputElement> & {
    multiple?: false;
    maxFiles?: 1;
};

type MultipleFileUploadProps = FieldProps<Array<GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment>, HTMLInputElement> & {
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
