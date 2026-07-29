import { useApolloClient } from "@apollo/client";
import { Button, useErrorDialog } from "@comet/admin";
import { ThreeDotSaving, Upload } from "@comet/admin-icons";
import { useRef, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { FormattedMessage } from "react-intl";

import { useCometConfig } from "../../config/CometConfigContext";
import { replaceById } from "../../form/file/upload";
import { useDamBasePath, useDamConfig } from "../config/damConfig";
import { getDamFileCategory } from "../config/damFileCategory";
import { useDamAcceptedMimeTypes } from "../config/useDamAcceptedMimeTypes";
import { convertMimetypesToDropzoneAccept } from "../DataGrid/fileUpload/fileUpload.utils";
import type { DamFileDetails } from "./EditFile";

interface ReplaceFileButtonProps {
    file: DamFileDetails;
}

export function ReplaceFileButton({ file }: ReplaceFileButtonProps) {
    const apolloClient = useApolloClient();
    const { apiUrl } = useCometConfig();
    const damConfig = useDamConfig();
    const damBasePath = useDamBasePath();
    const { filteredAcceptedMimeTypes } = useDamAcceptedMimeTypes();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const maxFileSizeInMegabytes = damConfig.uploadsMaxFileSize;
    const maxFileSizeInBytes = maxFileSizeInMegabytes * 1024 * 1024;
    const errorDialog = useErrorDialog();
    const [replaceLoading, setReplaceLoading] = useState(false);

    const acceptedMimeTypesForReplacement = filteredAcceptedMimeTypes[getDamFileCategory(file.mimetype)];

    const { getInputProps } = useDropzone({
        maxSize: maxFileSizeInBytes,
        multiple: false,
        accept: convertMimetypesToDropzoneAccept(acceptedMimeTypesForReplacement),
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                errorDialog?.showError({
                    userMessage: (
                        <FormattedMessage
                            id="comet.dam.file.replace.fileRejection"
                            defaultMessage="The selected file could not be uploaded because it doesn't meet the required criteria. A file can only be replaced by a file of the same type, for instance, an image by another image."
                        />
                    ),
                    error: fileRejections.toString(),
                });
                return;
            }

            try {
                setReplaceLoading(true);
                if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                }
                const abortController = new AbortController();
                abortControllerRef.current = abortController;
                const response = await replaceById({
                    apiUrl,
                    data: { file: acceptedFiles[0], fileId: file.id },
                    damBasePath,
                });
                if (response.data) {
                    const fileUrl = (response.data as { fileUrl?: string })?.fileUrl;
                    if (fileUrl) {
                        apolloClient.cache.evict({ id: `DamFile:${file.id}` });
                    }
                }
            } catch (error) {
                if (error instanceof DOMException && error.name === "AbortError") {
                    return;
                }
                const message = error instanceof Error ? error.message : String(error);

                errorDialog?.showError({
                    userMessage: (
                        <FormattedMessage
                            id="comet.dam.file.replace.error"
                            defaultMessage="An error occurred while replacing the file: {message}"
                            values={{ message }}
                        />
                    ),
                    error: message,
                });
            } finally {
                setReplaceLoading(false);
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
