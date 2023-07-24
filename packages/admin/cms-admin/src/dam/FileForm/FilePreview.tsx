import { useApolloClient } from "@apollo/client";
import { useStackApi } from "@comet/admin";
import { Archive, Delete, Download, Restore, ZipFile } from "@comet/admin-icons";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import saveAs from "file-saver";
import * as React from "react";
import { FormattedMessage } from "react-intl";

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
    color: ${({ theme }) => theme.palette.primary.contrastText};
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

export const FilePreview = ({ file }: FilePreviewProps): React.ReactElement => {
    const client = useApolloClient();
    const stackApi = useStackApi();
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);

    let preview: React.ReactNode;

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

    return (
        <FilePreviewWrapper>
            {/*// @TODO: Add functionality for these buttons*/}
            <ActionsContainer>
                <ActionButton
                    startIcon={<Download />}
                    onClick={() => {
                        saveAs(file.fileUrl, file.name);
                    }}
                >
                    <FormattedMessage id="comet.dam.file.downloadFile" defaultMessage="Download File" />
                </ActionButton>
                {/*<ActionButton startIcon={<Upload />}>*/}
                {/*    <FormattedMessage id="comet.dam.file.replaceFile" defaultMessage="Replace File" />*/}
                {/*</ActionButton>*/}
                <ActionButton
                    startIcon={file.archived ? <Restore /> : <Archive />}
                    onClick={() => {
                        if (file.archived) {
                            client.mutate<GQLRestoreFileMutation, GQLRestoreFileMutationVariables>({
                                mutation: restoreDamFileMutation,
                                variables: { id: file.id },
                            });
                        } else {
                            client.mutate<GQLArchiveFileMutation, GQLArchiveFileMutationVariables>({
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
                        await client.mutate<GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables>({
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
