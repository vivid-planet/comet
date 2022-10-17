import { useApolloClient } from "@apollo/client";
import { SplitButton } from "@comet/admin";
import { Upload } from "@comet/admin-icons";
import { Button } from "@mui/material";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormattedMessage } from "react-intl";

import { useDamAcceptedMimeTypes } from "../../config/useDamAcceptedMimeTypes";
import { useFileUpload } from "./useFileUpload";

interface UploadSplitButtonProps {
    folderId?: string;
    filter?: {
        allowedMimetypes?: string[];
    };
}

export const UploadSplitButton = ({ folderId, filter }: UploadSplitButtonProps): React.ReactElement => {
    const client = useApolloClient();
    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const folderInputRef = React.useRef<HTMLInputElement>(null);

    const {
        uploadFiles,
        dialogs: fileUploadDialogs,
        dropzoneConfig,
    } = useFileUpload({
        acceptedMimetypes: filter?.allowedMimetypes ?? allAcceptedMimeTypes,
        onAfterUpload: () => {
            client.reFetchObservableQueries();
        },
    });

    const { getInputProps } = useDropzone({
        ...dropzoneConfig,
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            await uploadFiles({ acceptedFiles, fileRejections }, folderId);
        },
    });

    return (
        <>
            <SplitButton localStorageKey="damUpload">
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Upload />}
                    onClick={() => {
                        // Add explicit onClick to make it work in SplitButton
                        fileInputRef.current?.click();
                    }}
                >
                    <FormattedMessage id="comet.pages.dam.uploadFiles" defaultMessage="Upload files" />
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Upload />}
                    onClick={() => {
                        // Add explicit onClick to make it work in SplitButton
                        folderInputRef.current?.click();
                    }}
                >
                    <FormattedMessage id="comet.pages.dam.uploadFolder" defaultMessage="Upload folder" />
                </Button>
            </SplitButton>
            <input type="file" hidden {...getInputProps()} ref={fileInputRef} />
            <input type="file" hidden {...getInputProps()} webkitdirectory="webkitdirectory" directory="directory" ref={folderInputRef} />
            {fileUploadDialogs}
        </>
    );
};
