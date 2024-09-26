import { gql } from "@apollo/client";
import { commonFileErrorMessages, ErrorFileSelectItem, FileSelect, FileSelectProps, LoadingFileSelectItem, ValidFileSelectItem } from "@comet/admin";
import { useMemo, useState } from "react";
import { FieldRenderProps } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { useCmsBlockContext } from "../../blocks/useCmsBlockContext";
import { GQLFinalFormFileUploadFragment } from "./FinalFormFileUpload.generated";

export const finalFormFileUploadFragment = gql`
    fragment FinalFormFileUpload on FileUpload {
        id
        name
        size
        downloadUrl
        previewUrlTemplate
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
    downloadUrl?: string;
    previewUrlTemplate?: string;
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
    Partial<FileSelectProps<GQLFinalFormFileUploadFragment>> & {
        previewImageWidth?: number;
    };

export const FinalFormFileUpload = <Multiple extends boolean | undefined>({
    input: { onChange, value: fieldValue, multiple },
    maxFiles,
    previewImageWidth = 640,
    ...restProps
}: FinalFormFileUploadProps<Multiple>) => {
    const [tooManyFilesSelected, setTooManyFilesSelected] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<LoadingFileSelectItem[]>([]);
    const [failedUploads, setFailedUploads] = useState<ErrorFileSelectItem[]>([]);
    const {
        damConfig: { apiUrl }, // TODO: Think of a better solution to get the apiUrl, as this has nothing to do with DAM
    } = useCmsBlockContext();

    const singleFile = (!multiple && typeof maxFiles === "undefined") || maxFiles === 1;
    const inputValue = useMemo<ValidFileSelectItem<GQLFinalFormFileUploadFragment>[]>(() => {
        const files = Array.isArray(fieldValue) ? fieldValue : fieldValue ? [fieldValue] : [];
        return files.map((file) => {
            let previewUrl: string | undefined = undefined;

            if (file.previewUrlTemplate) {
                const isNewlyUploadedFile = file.previewUrlTemplate.startsWith("blob:");

                if (isNewlyUploadedFile) {
                    previewUrl = file.previewUrlTemplate;
                } else {
                    previewUrl = `${apiUrl}${file.previewUrlTemplate.replace(":resizeWidth", String(previewImageWidth))}`;
                }
            }

            return {
                ...file,
                previewUrl,
            };
        });
    }, [fieldValue, apiUrl, previewImageWidth]);

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
                    const response = await fetch(`${apiUrl}/file-uploads/upload`, {
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
                            downloadUrl: jsonResponse.downloadUrl ?? null,
                            previewUrlTemplate: ["image/png", "image/jpeg", "image/gif"].includes(file.type) ? URL.createObjectURL(file) : null,
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
            getDownloadUrl={(file) => (file.downloadUrl ? `${apiUrl}${file.downloadUrl}` : undefined)}
            {...restProps}
        />
    );
};
