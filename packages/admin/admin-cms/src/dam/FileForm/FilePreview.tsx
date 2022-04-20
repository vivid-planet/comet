import { useApolloClient } from "@apollo/client";
import { useStackApi } from "@comet/admin";
import { Delete, Download, File } from "@comet/admin-icons";
import { Button, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import saveAs from "file-saver";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { GQLDamFileDetailFragment, GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables, namedOperations } from "../../graphql.generated";
import { ConfirmDeleteDialog } from "../FileActions/ConfirmDeleteDialog";
import { deleteDamFileMutation } from "../FileActions/ConfirmDeleteDialog.gql";
import { AudioPreview } from "./previews/AudioPreview";
import { ImagePreview } from "./previews/ImagePreview";
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

interface FilePreviewProps {
    file: GQLDamFileDetailFragment;
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
    } else {
        preview = <File />;
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
                {/*Todo: Readd Archive Button once archive filter exists*/}
                {/*<ActionButton*/}
                {/*    startIcon={file.archived ? <Restore /> : <Archive />}*/}
                {/*    onClick={() => {*/}
                {/*        if (file.archived) {*/}
                {/*            client.mutate<GQLRestoreFileMutation, GQLRestoreFileMutationVariables>({*/}
                {/*                mutation: restoreDamFileMutation,*/}
                {/*                variables: { id: file.id },*/}
                {/*            });*/}
                {/*        } else {*/}
                {/*            client.mutate<GQLArchiveFileMutation, GQLArchiveFileMutationVariables>({*/}
                {/*                mutation: archiveDamFileMutation,*/}
                {/*                variables: { id: file.id },*/}
                {/*            });*/}
                {/*        }*/}
                {/*    }}*/}
                {/*>*/}
                {/*    {file.archived ? (*/}
                {/*        <FormattedMessage id="comet.dam.file.restore" defaultMessage="Restore" />*/}
                {/*    ) : (*/}
                {/*        <FormattedMessage id="comet.dam.file.archive" defaultMessage="Archive" />*/}
                {/*    )}*/}
                {/*</ActionButton>*/}
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
                closeDialog={(ok) => {
                    setDeleteDialogOpen(false);
                    if (ok) {
                        stackApi?.goBack();
                    }
                }}
                onDeleteButtonClick={async () => {
                    await client.mutate<GQLDeleteDamFileMutation, GQLDeleteDamFileMutationVariables>({
                        mutation: deleteDamFileMutation,
                        variables: { id: file.id },
                        refetchQueries: [namedOperations.Query.DamFilesList],
                    });
                }}
                assetType="file"
                name={file.name}
            />
        </FilePreviewWrapper>
    );
};
