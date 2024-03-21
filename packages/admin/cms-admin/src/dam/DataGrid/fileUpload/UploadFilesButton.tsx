import { Upload } from "@comet/admin-icons";
import { Button } from "@mui/material";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormattedMessage } from "react-intl";

import { useDamAcceptedMimeTypes } from "../../config/useDamAcceptedMimeTypes";
import { useDamFileUpload } from "./useDamFileUpload";

interface UploadSplitButtonProps {
    folderId?: string;
    filter?: {
        allowedMimetypes?: string[];
    };
}

export const UploadFilesButton = ({ folderId, filter }: UploadSplitButtonProps): React.ReactElement => {
    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();

    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
                variant="contained"
                color="primary"
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
