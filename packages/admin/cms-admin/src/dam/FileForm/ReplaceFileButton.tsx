import { useApolloClient } from "@apollo/client";
import { Button, useErrorDialog } from "@comet/admin";
import { ThreeDotSaving, Upload } from "@comet/admin-icons";
import axios, { type CancelTokenSource } from "axios";
import { useRef, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { FormattedMessage } from "react-intl";

import { useCometConfig } from "../../config/CometConfigContext";
import { replaceById } from "../../form/file/upload";
import { createHttpClient } from "../../http/createHttpClient";
import { useDamBasePath, useDamConfig } from "../config/damConfig";
import { convertMimetypesToDropzoneAccept } from "../DataGrid/fileUpload/fileUpload.utils";
import { type DamFileDetails } from "./EditFile";

interface ReplaceFileButtonProps {
    file: DamFileDetails;
}

export function ReplaceFileButton({ file }: ReplaceFileButtonProps) {
    const apolloClient = useApolloClient();
    const { apiUrl } = useCometConfig();
    const damConfig = useDamConfig();
    const damBasePath = useDamBasePath();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const maxFileSizeInMegabytes = damConfig.uploadsMaxFileSize;
    const maxFileSizeInBytes = maxFileSizeInMegabytes * 1024 * 1024;
    const cancelUpload = useRef<CancelTokenSource>(axios.CancelToken.source());
    const errorDialog = useErrorDialog();
    const [replaceLoading, setReplaceLoading] = useState(false);

    const { getInputProps } = useDropzone({
        maxSize: maxFileSizeInBytes,
        multiple: false,
        accept: convertMimetypesToDropzoneAccept([file.mimetype]),
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                errorDialog?.showError({
                    userMessage: (
                        <FormattedMessage
                            id="comet.dam.file.replace.fileRejection"
                            defaultMessage="The selected file could not be uploaded because it doesn't meet the required criteria. Please choose a valid file to replace the existing one."
                        />
                    ),
                    error: fileRejections.toString(),
                });
            }

            try {
                setReplaceLoading(true);
                const response = await replaceById({
                    apiClient: createHttpClient(apiUrl),
                    data: { file: acceptedFiles[0], fileId: file.id },
                    cancelToken: cancelUpload.current.token,
                    damBasePath,
                });

                if (response.status === 201 && response.data) {
                    const fileUrl = (response.data as { fileUrl?: string })?.fileUrl;
                    if (fileUrl) {
                        apolloClient.cache.evict({ id: `DamFile:${file.id}` });
                    }
                }
                setReplaceLoading(false);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    errorDialog?.showError({
                        userMessage: (
                            <FormattedMessage
                                id="comet.dam.file.replace.error"
                                defaultMessage="An error occurred while replacing the file. Please try again later."
                            />
                        ),
                        error: error.response?.data,
                    });
                }
            }
        },
    });

    return (
        <>
            <Button
                variant="textLight"
                startIcon={replaceLoading ? <ThreeDotSaving /> : <Upload />}
                onClick={() => {
                    // Trigger file input with button click
                    fileInputRef.current?.click();
                }}
            >
                <FormattedMessage id="comet.dam.file.replaceFile" defaultMessage="Replace File" />
            </Button>
            <input type="file" hidden {...getInputProps()} ref={fileInputRef} />
        </>
    );
}
