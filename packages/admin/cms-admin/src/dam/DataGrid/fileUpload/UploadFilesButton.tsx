import { Button } from "@comet/admin";
import { Upload } from "@comet/admin-icons";
import { useRef } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormattedMessage } from "react-intl";

import { useDamAcceptedMimeTypes } from "../../config/useDamAcceptedMimeTypes";
import { useDamFileUpload } from "./useDamFileUpload";

interface UploadFilesButtonProps {
    folderId?: string;
    filter?: {
        allowedMimetypes?: string[];
    };
}

export const UploadFilesButton = ({ folderId, filter }: UploadFilesButtonProps) => {
    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        uploadFiles,
        dialogs: fileUploadDialogs,
        dropzoneConfig,
    } = useDamFileUpload({
        acceptedMimetypes: filter?.allowedMimetypes ?? allAcceptedMimeTypes,
    });

    const { getInputProps } = useDropzone({
        ...dropzoneConfig,
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            await uploadFiles({ acceptedFiles, fileRejections }, { folderId: folderId });
        },
    });

    return (
        <>
            <Button
                startIcon={<Upload />}
                onClick={() => {
                    // Trigger file input with button click
                    fileInputRef.current?.click();
                }}
            >
                <FormattedMessage id="comet.pages.dam.uploadFiles" defaultMessage="Upload files" />
            </Button>
            <input type="file" hidden {...getInputProps()} ref={fileInputRef} />
            {fileUploadDialogs}
        </>
    );
};
