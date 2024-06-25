import { gql } from "@apollo/client";
import { saveAs } from "file-saver";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { FileSelect, FileSelectProps } from "./FileSelect";
import { ErrorFileSelectItem, LoadingFileSelectItem } from "./fileSelectItemTypes";

export const finalFormFileUploadFragment = gql`
    fragment FinalFormFileUploadFragment on PublicUpload {
        id
        name
        size
    }
`;

// TODO: Can this type be generated from `finalFormFileUploadFragment` somehow?
export type FinalFormFileUploadFileData = {
    id: string;
    name: string;
    size: number;
};

export interface FinalFormFileUploadProps
    extends FieldRenderProps<FinalFormFileUploadFileData[], HTMLInputElement>,
        Partial<FileSelectProps<FinalFormFileUploadFileData>> {}

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

export const FinalFormFileUpload = ({ input, maxFiles, ...restProps }: FinalFormFileUploadProps) => {
    const [tooManyFilesSelected, setTooManyFilesSelected] = React.useState(false);
    const [uploadingFiles, setUploadingFiles] = React.useState<LoadingFileSelectItem[]>([]);
    const [failedUploads, setFailedUploads] = React.useState<ErrorFileSelectItem[]>([]);
    const [downloadingFileIds, setDownloadingFileIds] = React.useState<string[]>([]);
    const [failedToDownloadFileIds, setFailedToDownloadFileIds] = React.useState<string[]>([]);

    const singleFile = maxFiles === 1;
    const inputValue = React.useMemo(() => (input.value ? input.value : []), [input.value]);

    const files = [...inputValue, ...failedUploads, ...uploadingFiles].map((file) => {
        if ("id" in file && downloadingFileIds.includes(file.id)) {
            return { ...file, isDownloading: true };
        }

        if ("id" in file && failedToDownloadFileIds.includes(file.id)) {
            return { ...file, error: <FormattedMessage id="comet.finalFormFileUpload.downloadFailed" defaultMessage="Download failed." /> };
        }

        return file;
    });

    return (
        <FileSelect<FinalFormFileUploadFileData>
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

                    // TODO: Where do we get the url from?
                    return fetch("http://localhost:4000/public-upload/files/upload", {
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
                    input.onChange(successfullyUploadedFiles);
                } else {
                    input.onChange([...inputValue, ...successfullyUploadedFiles]);
                }
            }}
            onRemove={(fileToRemove) => {
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
                setDownloadingFileIds([...downloadingFileIds, file.id]);
                // TODO: Where do we get the url from?
                fetch(`http://localhost:4000/public-upload/files/download/${file.id}`).then(async (response) => {
                    if (!response.ok) {
                        setDownloadingFileIds(downloadingFileIds.filter((id) => id !== file.id));
                        setFailedToDownloadFileIds([...failedToDownloadFileIds, file.id]);
                        return;
                    }

                    response.blob().then((blob) => {
                        saveAs(blob, file.name);
                        setDownloadingFileIds(downloadingFileIds.filter((id) => id !== file.id));
                    });
                });
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
