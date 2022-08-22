import { useApolloClient } from "@apollo/client";
import { TableBodyRow, TableBodyRowProps } from "@comet/admin";
import { alpha, Checkbox, TableCell } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import * as React from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { FileRejection, useDropzone } from "react-dropzone";

import { GQLDamFileTableFragment, GQLDamFolderTableFragment } from "../../graphql.generated";
import { useDamAcceptedMimeTypes } from "../config/useDamAcceptedMimeTypes";
import { DamConfig } from "../DamTable";
import { FooterType } from "./DamDnDFooter";
import { useDamDnD } from "./dnd/useDamDnD";
import { useFileUpload } from "./fileUpload/useFileUpload";
import { useDamMultiselectApi } from "./multiselect/DamMultiselect";

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
    archived?: boolean;
    isNew?: boolean;
    scrollIntoView?: boolean;
}

export interface DamDragObject {
    item: GQLDamFileTableFragment | GQLDamFolderTableFragment;
}

const StyledFolderTableRow = styled(TableBodyRow)<TableBodyRowProps & { $activeHoverStyle: boolean; $archived: boolean; $highlightAsNew: boolean }>`
    height: 58px;
    position: relative;
    z-index: 0;

    outline: ${({ $activeHoverStyle, theme }) => ($activeHoverStyle ? `solid 1px ${theme.palette.primary.main};` : "none")};
    background: ${({ theme, $activeHoverStyle, $archived }) => {
        if ($activeHoverStyle) {
            return alpha(theme.palette.primary.main, 0.1);
        } else if ($archived) {
            return theme.palette.grey[50];
        }
        return "none";
    }};

    & .MuiTableCell-root {
        padding-top: 8px;
        padding-bottom: 8px;
    }

    &:before {
        content: "";
        position: absolute;
        z-index: -1;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: background-color 1s ease-in-out;

        ${({ $highlightAsNew, theme }) =>
            $highlightAsNew &&
            css`
                background-color: ${alpha(theme.palette.primary.dark, 0.4)};
            `}
    }
`;

export const FolderTableRow: React.FunctionComponent<FolderTableRowProps> = ({
    dropTargetItem,
    rowProps,
    children,
    footerApi,
    allowedMimetypes,
    archived,
    hideMultiselect,
    isNew = false,
    scrollIntoView = false,
}) => {
    const multiselectApi = useDamMultiselectApi();
    const client = useApolloClient();
    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();
    const { moveItem } = useDamDnD();

    const [isHovered, setIsHovered] = React.useState<HoverStyle>();
    const [markAsNew, setMarkAsNew] = React.useState<boolean>(false);

    React.useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (isNew) {
            setMarkAsNew(true);
            timeout = setTimeout(() => {
                setMarkAsNew(false);
            }, 3000);
        }

        return () => clearTimeout(timeout);
    }, [isNew]);

    const {
        uploadFiles,
        dialogs: fileUploadDialogs,
        dropzoneConfig,
    } = useFileUpload({
        acceptedMimetypes: allowedMimetypes ?? allAcceptedMimeTypes,
        onAfterUpload: () => {
            client.reFetchObservableQueries();
        },
    });

    // handles upload of native file or folder (e.g. file from desktop) to subfolder
    // If the native file is dropped on a folder row in the table, it is uploaded
    // to said folder
    const { getRootProps: getFolderRootProps, rootRef: rowRef } = useDropzone({
        ...dropzoneConfig,
        noClick: true,
        onDragOver: () => {
            setIsHovered("folder");
            footerApi.show("upload", dropTargetItem.name);
        },
        onDragLeave: () => {
            setIsHovered(undefined);
        },
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            setIsHovered(undefined);
            footerApi.hide();
            await uploadFiles({ acceptedFiles, fileRejections }, dropTargetItem?.id);
        },
    });

    // handles movement of an internal item (file or folder row) to another folder
    // If a row is dragged and dropped onto a folder row, it is moved to said folder
    const [{ isOverFolder, canDrop }, dropTarget] = useDrop({
        accept: ["folder", "asset"],
        drop: (dragObject: DamDragObject) => {
            if (isFile(dropTargetItem)) {
                return;
            }
            moveItem({ dropTargetItem, dragItem: dragObject.item });
        },
        canDrop: (dragObject: DamDragObject) => {
            return (
                dropTargetItem.id !== dragObject.item.id &&
                !(multiselectApi.isSelected(dragObject.item.id) && multiselectApi.isSelected(dropTargetItem.id))
            );
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
    }, [dragSource, dropTarget, dropTargetFile, dropTargetItem, rowRef]);

    React.useEffect(() => {
        if (scrollIntoView) {
            rowRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [rowRef, scrollIntoView]);

    return (
        <>
            <StyledFolderTableRow
                {...rowProps}
                {...(isFolder(dropTargetItem) && getFolderRootProps())}
                ref={rowRef as React.RefObject<HTMLTableRowElement>}
                $activeHoverStyle={isHovered === "folder"}
                $archived={archived ?? false}
                $highlightAsNew={markAsNew}
            >
                {!hideMultiselect && (
                    <TableCell>
                        <Checkbox
                            checked={multiselectApi.isSelected(dropTargetItem.id)}
                            onChange={(event) => {
                                const checked = event.target.checked;
                                if (checked) {
                                    multiselectApi.select({
                                        id: dropTargetItem.id,
                                        type: isFolder(dropTargetItem) ? "folder" : "file",
                                    });
                                } else {
                                    multiselectApi.unselect(dropTargetItem.id);
                                }
                            }}
                        />
                    </TableCell>
                )}
                {children}
            </StyledFolderTableRow>
            {fileUploadDialogs}
        </>
    );
};
