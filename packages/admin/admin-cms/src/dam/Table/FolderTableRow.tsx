import { useApolloClient, useMutation } from "@apollo/client";
import { LocalErrorScopeApolloContext, TableBodyRow, TableBodyRowProps } from "@comet/admin";
import * as React from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

import {
    GQLDamFileTableFragment,
    GQLDamFolderTableFragment,
    GQLUpdateDamFileMutation,
    GQLUpdateDamFileMutationVariables,
    GQLUpdateDamFolderMutation,
    GQLUpdateDamFolderMutationVariables,
    namedOperations,
} from "../../graphql.generated";
import { DamConfig } from "../DamTable";
import { FooterType } from "./DamDnDFooter";
import { acceptedMimeTypes, acceptedMimeTypesByCategory } from "./fileUpload/acceptedMimeTypes";
import { useFileUpload } from "./fileUpload/useFileUpload";
import { updateDamFileMutation, updateDamFolderMutation } from "./FolderTable.gql";

export const isFile = (item: GQLDamFileTableFragment | GQLDamFolderTableFragment): item is GQLDamFileTableFragment => item.__typename === "DamFile";
export const isFolder = (item: GQLDamFileTableFragment | GQLDamFolderTableFragment): item is GQLDamFolderTableFragment =>
    item.__typename === "DamFolder";

type HoverStyle = "file" | "folder" | undefined;

interface FolderTableRowProps extends DamConfig {
    dropTargetItem: GQLDamFileTableFragment | GQLDamFolderTableFragment;
    rowProps: TableBodyRowProps;
    footerApi: {
        show: (type: FooterType, folderName?: string) => void;
        hide: () => void;
    };
}

export interface DamDragObject {
    item: GQLDamFileTableFragment | GQLDamFolderTableFragment;
}

const StyledFolderTableRow = styled(TableBodyRow)<TableBodyRowProps & { $activeHoverStyle: boolean }>`
    height: 58px;

    outline: ${({ $activeHoverStyle, theme }) => ($activeHoverStyle ? `solid 1px ${theme.palette.primary.main};` : "none")};
    background: ${({ $activeHoverStyle }) => ($activeHoverStyle ? "rgba(41,182,246,0.1)" : "none")};

    & .MuiTableCell-root {
        padding-top: 8px;
        padding-bottom: 8px;
    }
`;

export const FolderTableRow: React.FunctionComponent<FolderTableRowProps> = ({
    dropTargetItem,
    rowProps,
    children,
    footerApi,
    fileCategory,
    allowedMimetypes,
}) => {
    const client = useApolloClient();

    const rowRef = React.useRef<HTMLTableRowElement>();
    const [updateFile] = useMutation<GQLUpdateDamFileMutation, GQLUpdateDamFileMutationVariables>(updateDamFileMutation);
    const [updateFolder] = useMutation<GQLUpdateDamFolderMutation, GQLUpdateDamFolderMutationVariables>(updateDamFolderMutation);
    const [isHovered, setIsHovered] = React.useState<HoverStyle>();

    const fileCategoryMimetypes = fileCategory ? acceptedMimeTypesByCategory[fileCategory] : undefined;
    const { uploadFiles, dialogs: fileUploadDialogs, dropzoneConfig } = useFileUpload({
        acceptedMimetypes: allowedMimetypes ?? fileCategoryMimetypes ?? acceptedMimeTypes,
        onAfterUpload: () => {
            client.reFetchObservableQueries();
        },
    });

    // handles upload of native file (e.g. file from desktop) to subfolder
    // If the native file is dropped on a folder row in the table, it is uploaded
    // to said folder
    const { getRootProps: getFolderRootProps } = useDropzone({
        ...dropzoneConfig,
        onDragOver: () => {
            setIsHovered("folder");
            footerApi.show("upload", dropTargetItem.name);
        },
        onDragLeave: () => {
            setIsHovered(undefined);
        },
        onDrop: async (acceptedFiles: File[], rejectedFiles: File[]) => {
            setIsHovered(undefined);
            footerApi.hide();
            await uploadFiles({ acceptedFiles, rejectedFiles }, dropTargetItem?.id);
        },
    });

    // handles movement of an internal file (file row) to another folder
    // If a file row is dragged and dropped on a folder row, it is moved to said folder
    const [{ isOverFolder, canDrop }, dropTarget] = useDrop({
        accept: ["folder", "asset"],
        drop: (dragObject: DamDragObject) => {
            if (isFile(dropTargetItem)) {
                return;
            }
            if (dropTargetItem.id === dragObject.item.id) {
                return;
            }

            if (isFile(dragObject.item)) {
                updateFile({
                    variables: {
                        id: dragObject.item.id,
                        input: {
                            folderId: dropTargetItem.id,
                        },
                    },
                    refetchQueries: [namedOperations.Query.DamFilesList, namedOperations.Query.DamFoldersList],
                    context: LocalErrorScopeApolloContext,
                });
            } else if (isFolder(dragObject.item)) {
                updateFolder({
                    variables: {
                        id: dragObject.item.id,
                        input: {
                            parentId: dropTargetItem.id,
                        },
                    },
                    refetchQueries: [namedOperations.Query.DamFilesList, namedOperations.Query.DamFoldersList],
                    context: LocalErrorScopeApolloContext,
                });
            }
        },
        canDrop: (dragObject: DamDragObject) => {
            return dropTargetItem.id !== dragObject.item.id;
        },
        collect: (monitor) => ({
            isOverFolder: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    React.useEffect(() => {
        if (isOverFolder && canDrop) {
            setIsHovered("folder");
            footerApi.show("move", dropTargetItem.name);
        } else if (isOverFolder && !canDrop) {
            footerApi.hide();
            setIsHovered(undefined);
        } else {
            setIsHovered(undefined);
        }
        // state set only needs to be done if isOver changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOverFolder]);

    // If an internal file or folder is hovered over a file, it cannot be dropped.
    // This useDrop is only used for resetting the hover styles in such a case.
    const [{ isOverFile }, dropTargetFile] = useDrop({
        accept: ["folder", "asset"],
        collect: (monitor) => ({
            isOverFile: monitor.isOver(),
        }),
    });

    React.useEffect(() => {
        if (isOverFile) {
            footerApi.hide();
        }
        // state reset only needs to be done if isOver changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOverFile]);

    const [, dragSource, preview] = useDrag({
        type: isFolder(dropTargetItem) ? "folder" : "asset",
        item: { item: dropTargetItem },
    });

    // Is necessary for the CustomDragLayer to work
    React.useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
        // as seen in react-dnd-Doku:
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        dragSource(rowRef);
        if (isFolder(dropTargetItem)) {
            dropTarget(rowRef);
        }
        if (isFile(dropTargetItem)) {
            dropTargetFile(rowRef);
        }
    }, [dragSource, dropTarget, dropTargetFile, dropTargetItem]);

    return (
        <>
            <StyledFolderTableRow
                {...rowProps}
                innerRef={rowRef}
                {...(isFolder(dropTargetItem) && getFolderRootProps())}
                $activeHoverStyle={isHovered === "folder"}
            >
                {children}
            </StyledFolderTableRow>
            {fileUploadDialogs}
        </>
    );
};
