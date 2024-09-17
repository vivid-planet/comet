import { gql } from "@apollo/client";
import { commonFileErrorMessages, ErrorFileSelectItem, FileSelect, FileSelectProps, LoadingFileSelectItem } from "@comet/admin";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { useCometConfig } from "../../config/CometConfigContext";
import { GQLFinalFormFileUploadFragment } from "./FinalFormFileUpload.generated";

export const finalFormFileUploadFragment = gql`
    fragment FinalFormFileUpload on FileUpload {
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
    statusCode?: number;
    message?: string;
    error?: string;
};

type FinalFormFileUploadSingleFileProps = FieldRenderProps<GQLFinalFormFileUploadFragment, HTMLInputElement> & {
    multiple?: false;
    maxFiles?: 1;
};

type FinalFormFileUploadMultipleFilesProps = FieldRenderProps<GQLFinalFormFileUploadFragment[], HTMLInputElement> & {
    multiple: true;
    maxFiles?: number;
};

export type FinalFormFileUploadProps<Multiple extends boolean | undefined> = (Multiple extends true
    ? FinalFormFileUploadMultipleFilesProps
    : FinalFormFileUploadSingleFileProps) &
    Partial<FileSelectProps<GQLFinalFormFileUploadFragment>>;

export const FinalFormFileUpload = <Multiple extends boolean | undefined>({
    input: { onChange, value: fieldValue, multiple },
    maxFiles,
    ...restProps
}: FinalFormFileUploadProps<Multiple>) => {
    const [tooManyFilesSelected, setTooManyFilesSelected] = React.useState(false);
    const [uploadingFiles, setUploadingFiles] = React.useState<LoadingFileSelectItem[]>([]);
    const [failedUploads, setFailedUploads] = React.useState<ErrorFileSelectItem[]>([]);
    const cometConfig = useCometConfig();

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
                        failedFile.error = commonFileErrorMessages.fileTooLarge;
                    }

                    if (rejection.errors.some((error) => error.code === "file-invalid-type")) {
                        failedFile.error = commonFileErrorMessages.invalidFileType;
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
                    const response = await fetch(`${cometConfig.apiUrl}/file-uploads/upload`, {
                        method: "POST",
                        body: formData,
                    });
                    const jsonResponse: SuccessfulApiResponse | FailedApiResponse = await response.json();

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
                        let errorMessage = <FormattedMessage id="comet.finalFormFileUpload.uploadFailed" defaultMessage="Upload failed." />;

                        if (jsonResponse.message === "Unsupported mime type") {
                            errorMessage = commonFileErrorMessages.invalidFileType;
                        }

                        setUploadingFiles((existing) => existing.filter((loadingFile) => loadingFile.name !== file.name));
                        setFailedUploads((existing) => [
                            ...existing,
                            {
                                name: file.name,
                                error: errorMessage,
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
            files={files}
            multiple={multiple}
            maxFiles={maxFiles}
            error={typeof maxFiles !== "undefined" && tooManyFilesSelected ? commonFileErrorMessages.tooManyFiles(maxFiles) : undefined}
            {...restProps}
        />
    );
};
