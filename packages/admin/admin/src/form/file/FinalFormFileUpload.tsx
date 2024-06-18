import { FileSelectItem } from "@comet/admin";
import { saveAs } from "file-saver";
import React from "react";
import { FieldRenderProps } from "react-final-form";
import { useIntl } from "react-intl";

import { FileSelect, FileSelectProps } from "./FileSelect";

export interface FinalFormFileUploadProps extends FieldRenderProps<string[], HTMLInputElement>, Partial<FileSelectProps<AdditionalFileData>> {}

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

type AdditionalFileData = {
    id: string;
};

export const FinalFormFileUpload = ({ input, maxFiles, ...restProps }: FinalFormFileUploadProps) => {
    const intl = useIntl();
    const [tooManyFilesSelected, setTooManyFilesSelected] = React.useState(false);
    const [loadedFiles, setLoadedFiles] = React.useState<Record<string, FileSelectItem<AdditionalFileData>>>({});
    const [uploadingFiles, setUploadingFiles] = React.useState<File[]>([]);
    const [failedUploads, setFailedUploads] = React.useState<File[]>([]);

    const inputValue = React.useMemo(() => (input.value ? input.value : []), [input.value]);

    const getErrorMessage = React.useCallback(
        (response: FailedApiResponse) => {
            if (response.statusCode === 404) {
                return intl.formatMessage({ id: "fileUpload.error.fileNotFound", defaultMessage: "File could not be found" });
            }

            return intl.formatMessage({ id: "fileUpload.error.unknown", defaultMessage: "File could not be loaded" });
        },
        [intl],
    );

    const fetchFile = React.useCallback(
        async (fileId: string) => {
            // TODO: Where do we get the url from?
            fetch(`http://localhost:4000/public-upload/files/${fileId}`)
                .then((response) => response.json())
                .then((resopnse: ApiResponse) => {
                    const fileData =
                        "id" in resopnse
                            ? {
                                  id: resopnse.id,
                                  name: resopnse.name,
                                  size: resopnse.size,
                              }
                            : { id: fileId, error: getErrorMessage(resopnse) };

                    setLoadedFiles((prevLoadedFiles) => ({
                        ...prevLoadedFiles,
                        [fileId]: fileData,
                    }));
                })
                .catch(() => {
                    setLoadedFiles((prevLoadedFiles) => ({
                        ...prevLoadedFiles,
                        [fileId]: { id: fileId, error: true },
                    }));
                });
        },
        [getErrorMessage],
    );

    React.useEffect(() => {
        inputValue?.forEach((id) => {
            fetchFile(id);
        });
    }, [inputValue, fetchFile]);

    const files: FileSelectItem<AdditionalFileData>[] = inputValue.map((id) => {
        if (id in loadedFiles) {
            return loadedFiles[id];
        }

        return {
            id,
            loading: true,
        };
    });

    const failedFileValues: FileSelectItem<AdditionalFileData>[] = failedUploads.map((file) => {
        return {
            name: file.name,
            error: true,
        };
    });

    const uploadingFileValues: FileSelectItem<AdditionalFileData>[] = uploadingFiles.map((file) => {
        return {
            name: file.name,
            loading: true,
        };
    });

    return (
        <FileSelect<AdditionalFileData>
            onDrop={async (acceptedFiles, rejectedFiles) => {
                const tooManyFilesWereDropped = rejectedFiles.some((rejection) => rejection.errors.some((error) => error.code === "too-many-files"));

                setTooManyFilesSelected(tooManyFilesWereDropped);

                if (tooManyFilesWereDropped) {
                    return;
                }

                if (acceptedFiles.length) {
                    setUploadingFiles(acceptedFiles);
                }

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
                    console.error("###", "Upload failed", { file, successfulUploads: successfulUploadResponses, acceptedFiles });
                    setFailedUploads((prevFailedUploads) => [...prevFailedUploads, file]);
                });

                input.onChange([...inputValue, ...successfulUploadResponses.map((item) => item.id)]);
            }}
            onRemove={(fileToRemove) => {
                if ("id" in fileToRemove) {
                    input.onChange(inputValue.filter((id) => id !== fileToRemove.id));

                    setLoadedFiles((existingFiles) => {
                        const newFiles: Record<string, FileSelectItem<AdditionalFileData>> = {};

                        for (const key in existingFiles) {
                            if (key !== fileToRemove.id) {
                                newFiles[key] = existingFiles[key];
                            }
                        }

                        return newFiles;
                    });
                }

                if ("error" in fileToRemove) {
                    setFailedUploads((existingFiles) => existingFiles.filter((failedFile) => failedFile.name !== fileToRemove.name));
                }

                if ("loading" in fileToRemove) {
                    setUploadingFiles((existingFiles) => existingFiles.filter((uploadingFile) => uploadingFile.name !== fileToRemove.name));
                }
            }}
            onDownload={async (file) => {
                // TODO: Where do we get the url from?
                fetch(`http://localhost:4000/public-upload/files/download/${file.id}`)
                    .then((response) => response.blob())
                    .then((blob) => {
                        saveAs(blob, file.name);
                    });
            }}
            files={[...files, ...failedFileValues, ...uploadingFileValues]}
            maxFiles={maxFiles}
            error={
                tooManyFilesSelected ? "Upload was canceled. You can only upload a maximum of 4 files, please reduce your selection." : undefined // TODO: Translate
            }
            {...restProps}
        />
    );
};
