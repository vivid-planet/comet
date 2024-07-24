import { gql } from "@apollo/client";
import { ErrorFileSelectItem, FileSelect, FileSelectProps, LoadingFileSelectItem } from "@comet/admin";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { useCmsBlockContext } from "../../blocks/useCmsBlockContext";
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

export type FinalFormFileUploadProps<MaxFiles> = (MaxFiles extends 1
    ? { maxFiles?: MaxFiles } & FieldRenderProps<GQLFinalFormFileUploadFragment, HTMLInputElement>
    : { maxFiles?: MaxFiles } & FieldRenderProps<GQLFinalFormFileUploadFragment[], HTMLInputElement>) &
    Partial<FileSelectProps<GQLFinalFormFileUploadFragment>>;

export const FinalFormFileUpload = <MaxFiles extends number | undefined>({
    input: { onChange, value: fieldValue, multiple },
    maxFiles,
    ...restProps
}: FinalFormFileUploadProps<MaxFiles>) => {
    const [tooManyFilesSelected, setTooManyFilesSelected] = React.useState(false);
    const [uploadingFiles, setUploadingFiles] = React.useState<LoadingFileSelectItem[]>([]);
    const [failedUploads, setFailedUploads] = React.useState<ErrorFileSelectItem[]>([]);
    const {
        damConfig: { apiUrl }, // TODO: Think of a better solution to get the apiUrl, as this has nothing to do with DAM
    } = useCmsBlockContext();

    const singleFile = (!multiple && typeof maxFiles === "undefined") || maxFiles === 1;
    const inputValue = React.useMemo(() => (Array.isArray(fieldValue) ? fieldValue : fieldValue ? [fieldValue] : []), [fieldValue]);

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

                    if (rejection.errors.some((error) => error.code === "file-invalid-type")) {
                        failedFile.error = (
                            <FormattedMessage id="comet.finalFormFileUpload.fileInvalidType" defaultMessage="File type is not allowed." />
                        );
                    }

                    setFailedUploads((existing) => [...existing, failedFile]);
                });

                if (singleFile) {
                    onChange(undefined);
                }

                if (tooManyFilesWereDropped || !acceptedFiles.length) {
                    return;
                }

                setUploadingFiles(acceptedFiles.map((file) => ({ name: file.name, loading: true })));

                const successfullyUploadedFiles: GQLFinalFormFileUploadFragment[] = [];

                for (const file of acceptedFiles) {
                    const formData = new FormData();
                    formData.append("file", file);
                    const response = await fetch(`${apiUrl}/public-upload/files/upload`, {
                        method: "POST",
                        body: formData,
                    });
                    const jsonResponse: SuccessfulApiResponse = await response.json();

                    if ("id" in jsonResponse) {
                        setUploadingFiles((existing) => existing.filter((loadingFile) => loadingFile.name !== file.name));
                        const newlyUploadedFile: GQLFinalFormFileUploadFragment = {
                            id: jsonResponse.id,
                            name: jsonResponse.name,
                            size: jsonResponse.size,
                        };

                        if (singleFile) {
                            onChange(newlyUploadedFile);
                        } else {
                            successfullyUploadedFiles.push(newlyUploadedFile);
                            onChange([...inputValue, ...successfullyUploadedFiles]);
                        }
                    } else {
                        setUploadingFiles((existing) => existing.filter((loadingFile) => loadingFile.name !== file.name));
                        setFailedUploads((existing) => [
                            ...existing,
                            {
                                name: file.name,
                                error: <FormattedMessage id="comet.finalFormFileUpload.uploadFailed" defaultMessage="Upload failed." />,
                            },
                        ]);
                    }
                }
            }}
            onRemove={(fileToRemove) => {
                setTooManyFilesSelected(false);

                if (singleFile) {
                    onChange(undefined);
                } else if ("id" in fileToRemove) {
                    onChange(inputValue.filter(({ id }) => id !== fileToRemove.id));
                }

                if ("error" in fileToRemove) {
                    setFailedUploads((existingFiles) => existingFiles.filter((failedFile) => failedFile.name !== fileToRemove.name));
                }
            }}
            getDownloadUrl={(file) => `${apiUrl}/public-upload/files/download/${file.id}`}
            files={files}
            multiple={multiple}
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
