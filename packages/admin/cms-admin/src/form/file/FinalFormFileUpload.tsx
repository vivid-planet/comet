import { gql } from "@apollo/client";
import { ErrorFileSelectItem, FileSelect, FileSelectProps, LoadingFileSelectItem } from "@comet/admin";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { GQLFinalFormFileUploadFragment } from "./FinalFormFileUpload.generated";

export const finalFormFileUploadFragment = gql`
    fragment FinalFormFileUpload on PublicUpload {
        id
        name
        size
    }
`;

type SuccessfulApiResponse = {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    size: number;
    mimetype: string;
    contentHash: string;
};

type FailedApiResponse = {
    statusCode: number;
    message: string;
};

type ApiResponse = SuccessfulApiResponse | FailedApiResponse;

export type FinalFormFileUploadProps<MaxFiles> = (MaxFiles extends 1
    ? { maxFiles?: MaxFiles } & FieldRenderProps<GQLFinalFormFileUploadFragment, HTMLInputElement>
    : { maxFiles?: MaxFiles } & FieldRenderProps<GQLFinalFormFileUploadFragment[], HTMLInputElement>) &
    Partial<FileSelectProps<GQLFinalFormFileUploadFragment>>;

export const FinalFormFileUpload = <MaxFiles extends number | undefined>({ input, maxFiles, ...restProps }: FinalFormFileUploadProps<MaxFiles>) => {
    const [tooManyFilesSelected, setTooManyFilesSelected] = React.useState(false);
    const [uploadingFiles, setUploadingFiles] = React.useState<LoadingFileSelectItem[]>([]);
    const [failedUploads, setFailedUploads] = React.useState<ErrorFileSelectItem[]>([]);

    const apiUrl = "http://localhost:4000"; // TODO: Where do we get the url from? Env? Hook?

    const singleFile = maxFiles === 1;
    const inputValue = React.useMemo(() => (Array.isArray(input.value) ? input.value : input.value ? [input.value] : []), [input.value]);

    const files = [...inputValue, ...failedUploads, ...uploadingFiles];

    return (
        <FileSelect<GQLFinalFormFileUploadFragment>
            onDrop={async (acceptedFiles, rejectedFiles) => {
                setFailedUploads([]);

                const tooManyFilesWereDropped = rejectedFiles.some((rejection) => rejection.errors.some((error) => error.code === "too-many-files"));
                setTooManyFilesSelected(tooManyFilesWereDropped);

                rejectedFiles.map((rejection) => {
                    const failedFile: ErrorFileSelectItem = {
                        name: rejection.file.name,
                        error: true,
                    };

                    if (rejection.errors.some((error) => error.code === "file-too-large")) {
                        failedFile.error = <FormattedMessage id="comet.finalFormFileUpload.fileTooLarge" defaultMessage="File is too large." />;
                    }

                    setFailedUploads((existing) => [...existing, failedFile]);
                });

                if (singleFile) {
                    input.onChange(undefined);
                }

                if (tooManyFilesWereDropped || !acceptedFiles.length) {
                    return;
                }

                setUploadingFiles(acceptedFiles.map((file) => ({ name: file.name, loading: true })));

                const fetches = acceptedFiles.map((file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    return fetch(`${apiUrl}/public-upload/files/upload`, {
                        method: "POST",
                        body: formData,
                    });
                });

                const responses = await Promise.all(fetches)
                    .then((responses) => Promise.all(responses.map((response) => response.json() as Promise<ApiResponse>)))
                    .finally(() => {
                        setUploadingFiles(uploadingFiles.filter((loadingFile) => !acceptedFiles.some((file) => file.name === loadingFile.name)));
                    });

                const successfulUploadResponses = responses.filter((item) => "id" in item) as SuccessfulApiResponse[];
                const failedUploads = acceptedFiles.filter((file) => !successfulUploadResponses.some((item) => item.name === file.name));

                failedUploads.forEach((file) => {
                    setFailedUploads((prevFailedUploads) => [
                        ...prevFailedUploads,
                        {
                            name: file.name,
                            error: <FormattedMessage id="comet.finalFormFileUpload.uploadFailed" defaultMessage="Upload failed." />,
                        },
                    ]);
                });

                const successfullyUploadedFiles = [...successfulUploadResponses.map(({ id, name, size }) => ({ id, name, size }))];

                if (singleFile) {
                    if (successfullyUploadedFiles.length) {
                        input.onChange(successfullyUploadedFiles[0]);
                    }
                } else {
                    input.onChange([...inputValue, ...successfullyUploadedFiles]);
                }
            }}
            onRemove={(fileToRemove) => {
                setTooManyFilesSelected(false);

                if (singleFile) {
                    input.onChange(undefined);
                } else if ("id" in fileToRemove) {
                    input.onChange(inputValue.filter(({ id }) => id !== fileToRemove.id));
                }

                if ("error" in fileToRemove) {
                    setFailedUploads((existingFiles) => existingFiles.filter((failedFile) => failedFile.name !== fileToRemove.name));
                }
            }}
            onDownload={async (file) => {
                window.open(`${apiUrl}/public-upload/files/download/${file.id}`);
            }}
            files={files}
            maxFiles={maxFiles}
            error={
                tooManyFilesSelected ? (
                    <FormattedMessage
                        id="comet.finalFormFileUpload.maximumFilesAmount"
                        defaultMessage="Upload was canceled. You can only upload a maximum of {maxFiles} {maxFiles, plural, one {file} other {files}}, please reduce your selection."
                        values={{ maxFiles }}
                    />
                ) : undefined
            }
            {...restProps}
        />
    );
};
