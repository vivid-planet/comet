import { useApolloClient } from "@apollo/client";
import { useErrorDialog, useStackApi } from "@comet/admin";
import { Archive, Delete, Download, Restore, ThreeDotSaving, Upload, ZipFile } from "@comet/admin-icons";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios, { CancelTokenSource } from "axios";
import saveAs from "file-saver";
import { ReactNode, useRef, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormattedMessage } from "react-intl";

import { useCmsBlockContext } from "../../blocks/useCmsBlockContext";
import { replaceById } from "../../form/file/upload";
import { convertMimetypesToDropzoneAccept } from "../DataGrid/fileUpload/fileUpload.utils";
import { ConfirmDeleteDialog } from "../FileActions/ConfirmDeleteDialog";
import { clearDamItemCache } from "../helpers/clearDamItemCache";
import { DamFileDetails } from "./EditFile";
import { archiveDamFileMutation, deleteDamFileMutation, restoreDamFileMutation } from "./FilePreview.gql";
import {
    GQLArchiveFileMutation,
    GQLArchiveFileMutationVariables,
    GQLDeleteDamFileMutation,
    GQLDeleteDamFileMutationVariables,
    GQLRestoreFileMutation,
    GQLRestoreFileMutationVariables,
} from "./FilePreview.gql.generated";
import { AudioPreview } from "./previews/AudioPreview";
import { DefaultFilePreview } from "./previews/DefaultFilePreview";
import { ImagePreview } from "./previews/ImagePreview";
import { PdfPreview } from "./previews/PdfPreview";
import { VideoPreview } from "./previews/VideoPreview";

const ActionsContainer = styled("div")`
    background-color: ${({ theme }) => theme.palette.grey["A400"]};
    display: flex;
    justify-content: center;
`;

const ActionButton = styled(Button)`
    color: white;
`;

const FileWrapper = styled(Paper)`
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FilePreviewWrapper = styled("div")`
    width: 100%;
`;

const ZipFileIcon = styled(ZipFile)`
    color: ${({ theme }) => theme.palette.primary.main};
    width: 54px;
    height: 72px;
`;

interface FilePreviewProps {
    file: DamFileDetails;
}

export const FilePreview = ({ file }: FilePreviewProps) => {
    const apolloClient = useApolloClient();
    const stackApi = useStackApi();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    let preview: ReactNode;

    if (file.mimetype.startsWith("image/") && file.image !== undefined) {
        preview = <ImagePreview file={file} />;
    } else if (file.mimetype.startsWith("audio/")) {
        preview = <AudioPreview file={file} />;
    } else if (file.mimetype.startsWith("video/")) {
        preview = <VideoPreview file={file} />;
    } else if (file.mimetype === "application/pdf") {
        preview = <PdfPreview file={file} />;
    } else if (["application/x-zip-compressed", "application/zip"].includes(file.mimetype)) {
        preview = <DefaultFilePreview customIcon={<ZipFileIcon />} />;
    } else {
        preview = <DefaultFilePreview />;
    }

    const cmsBlockContext = useCmsBlockContext(); // TODO create separate CmsContext?
    const fileInputRef = useRef<HTMLInputElement>(null);

    const maxFileSizeInMegabytes = cmsBlockContext.damConfig.maxFileSize;
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
                    apiClient: cmsBlockContext.damConfig.apiClient,
                    data: { file: acceptedFiles[0], fileId: file.id },
                    cancelToken: cancelUpload.current.token,
                });

                if (response.status === 201 && response.data) {
                    const fileUrl = (response.data as { fileUrl?: string })?.fileUrl;
                    if (fileUrl) {
                        apolloClient.cache.modify({
                            id: `DamFile:${file.id}`,
                            fields: {
                                fileUrl: () => fileUrl,
                            },
                        });
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
        <FilePreviewWrapper>
            <ActionsContainer>
                <ActionButton
                    startIcon={<Download />}
                    onClick={() => {
                        saveAs(file.fileUrl, file.name);
                    }}
                >
                    <FormattedMessage id="comet.dam.file.downloadFile" defaultMessage="Download File" />
                </ActionButton>
                <ActionButton
                    startIcon={replaceLoading ? <ThreeDotSaving /> : <Upload />}
                    onClick={() => {
                        // Trigger file input with button click
                        fileInputRef.current?.click();
                    }}
                >
                    <FormattedMessage id="comet.dam.file.replaceFile" defaultMessage="Replace File" />
                </ActionButton>
                <input type="file" hidden {...getInputProps()} ref={fileInputRef} />
                <ActionButton
                    startIcon={file.archived ? <Restore /> : <Archive />}
                    onClick={() => {
                        if (file.archived) {
                            apolloClient.mutate<GQLRestoreFileMutation, GQLRestoreFileMutationVariables>({
                                mutation: restoreDamFileMutation,
                                variables: { id: file.id },
                            });
                        } else {
                            apolloClient.mutate<GQLArchiveFileMutation, GQLArchiveFileMutationVariables>({
                                mutation: archiveDamFileMutation,
                                variables: { id: file.id },
                            });
                        }
                    }}
                >
                    {file.archived ? (
                        <FormattedMessage id="comet.dam.file.restore" defaultMessage="Restore" />
                    ) : (
                        <FormattedMessage id="comet.dam.file.archive" defaultMessage="Archive" />
                    )}
                </ActionButton>
                <ActionButton
                    startIcon={<Delete />}
                    onClick={() => {
                        setDeleteDialogOpen(true);
                    }}
                >
                    <FormattedMessage id="comet.dam.file.delete" defaultMessage="Delete" />
                </ActionButton>
            </ActionsContainer>
            <FileWrapper>{preview}</FileWrapper>
            <ConfirmDeleteDialog
                open={deleteDialogOpen}
                onCloseDialog={async (confirmed) => {
                    if (confirmed) {
                        await apolloClient.mutate<GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables>({
                            mutation: deleteDamFileMutation,
                            variables: { id: file.id },
                            refetchQueries: ["DamItemsList"],
                            update: (cache) => {
                                clearDamItemCache(cache);
                            },
                        });

                        stackApi?.goBack();
                    }

                    setDeleteDialogOpen(false);
                }}
                itemType="file"
                name={file.name}
            />
        </FilePreviewWrapper>
    );
};
