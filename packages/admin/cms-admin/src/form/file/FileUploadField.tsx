import { Field, type FieldProps } from "@comet/admin";
import { useCallback, useRef } from "react";

import { FinalFormFileUpload, type FinalFormFileUploadProps } from "./FinalFormFileUpload";
import type { GQLFinalFormFileUploadDownloadableFragment, GQLFinalFormFileUploadFragment } from "./FinalFormFileUpload.generated";

type SingleFileUploadProps = FieldProps<GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment, HTMLInputElement> &
    FinalFormFileUploadProps<false>;

type MultipleFileUploadProps = FieldProps<Array<GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment>, HTMLInputElement> &
    FinalFormFileUploadProps<true>;

export type FileUploadFieldProps<Multiple extends boolean | undefined> = Multiple extends true ? MultipleFileUploadProps : SingleFileUploadProps;

export const FileUploadField = <Multiple extends boolean | undefined>({
    name,
    validate: externalValidate,
    ...restProps
}: FileUploadFieldProps<Multiple>) => {
    const uploadingDeferredRef = useRef<{
        promise: Promise<undefined>;
        resolve: () => void;
    } | null>(null);
    const uploadingCountRef = useRef(0);

    const uploadingValidate = useCallback((_value: unknown): Promise<undefined> | undefined => {
        if (uploadingCountRef.current > 0) {
            return uploadingDeferredRef.current?.promise;
        }
        return undefined;
    }, []);

    const handleUploadingChange = useCallback((isUploading: boolean) => {
        if (isUploading) {
            uploadingCountRef.current++;
            if (!uploadingDeferredRef.current) {
                let resolve!: () => void;
                const promise = new Promise<undefined>((res) => {
                    resolve = () => res(undefined);
                });
                uploadingDeferredRef.current = { promise, resolve };
            }
        } else {
            uploadingCountRef.current = Math.max(0, uploadingCountRef.current - 1);
            if (uploadingCountRef.current === 0 && uploadingDeferredRef.current) {
                uploadingDeferredRef.current.resolve();
                uploadingDeferredRef.current = null;
            }
        }
    }, []);

    const validate = useCallback(
        (value: unknown, allValues: object, meta?: unknown) => {
            const uploadingError = uploadingValidate(value);
            if (uploadingError !== undefined) {
                return uploadingError;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return externalValidate?.(value as any, allValues, meta as any);
        },
        [externalValidate, uploadingValidate],
    );

    return (
        <Field<
            Multiple extends true
                ? Array<GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment>
                : GQLFinalFormFileUploadFragment | GQLFinalFormFileUploadDownloadableFragment
        >
            component={FinalFormFileUpload}
            name={name}
            validate={validate}
            onUploadingChange={handleUploadingChange}
            {...restProps}
        />
    );
};
