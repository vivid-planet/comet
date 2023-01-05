import { useApolloClient, useQuery } from "@apollo/client";
import { FetchResult } from "@apollo/client/link/core";
import { BreadcrumbItem, EditDialog, IFilterApi, ISelectionApi, PrettyBytes, useDataGridRemote, useStackSwitchApi } from "@comet/admin";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from "react-intl";
import { useDebouncedCallback } from "use-debounce";

import {
    GQLDamFolderQuery,
    GQLDamFolderQueryVariables,
    GQLDamItemListPositionQuery,
    GQLDamItemListPositionQueryVariables,
    GQLDamItemsListQuery,
    GQLDamItemsListQueryVariables,
    GQLDamItemTypeLiteral,
    GQLMoveDamFilesMutation,
    GQLMoveDamFilesMutationVariables,
    GQLMoveDamFoldersMutation,
    GQLMoveDamFoldersMutationVariables,
} from "../../graphql.generated";
import { useDamAcceptedMimeTypes } from "../config/useDamAcceptedMimeTypes";
import { DamConfig, DamFilter } from "../DamTable";
import AddFolder from "../FolderForm/AddFolder";
import EditFolder from "../FolderForm/EditFolder";
import { clearDamItemCache } from "../helpers/clearDamItemCache";
import { isFile } from "../helpers/isFile";
import { isFolder } from "../helpers/isFolder";
import DamContextMenu from "./DamContextMenu";
import { useFileUpload } from "./fileUpload/useFileUpload";
import { damFolderQuery, damItemListPosition, damItemsListQuery } from "./FolderDataGrid.gql";
import * as sc from "./FolderDataGrid.sc";
import { FolderHead } from "./FolderHead";
import { DamSelectionFooter } from "./footer/SelectionFooter";
import { DamUploadFooter } from "./footer/UploadFooter";
import { DamItemLabelColumn } from "./label/DamItemLabelColumn";
import { MoveDamItemDialog } from "./moveDialog/MoveDamItemDialog";
import { moveDamFilesMutation, moveDamFoldersMutation } from "./moveDialog/MoveDamItemDialog.gql";
import { useDamSearchHighlighting } from "./useDamSearchHighlighting";

export type DamItemSelectionMap = Map<string, "file" | "folder">;

interface FolderDataGridProps extends DamConfig {
    id?: string;
    breadcrumbs?: BreadcrumbItem[];
    filterApi: IFilterApi<DamFilter>;
    selectionApi: ISelectionApi;
}

export const FolderDataGrid = ({
    id: currentFolderId,
    filterApi,
    breadcrumbs,
    selectionApi,
    hideContextMenu,
    hideArchiveFilter,
    hideMultiselect,
    renderDamLabel,
    TableHeadActionButton,
    ...props
}: FolderDataGridProps): React.ReactElement => {
    const intl = useIntl();
    const apolloClient = useApolloClient();
    const switchApi = useStackSwitchApi();

    const [selectionMap, setSelectionMap] = React.useState<DamItemSelectionMap>(new Map());
    const [uploadTargetFolderName, setUploadTargetFolderName] = React.useState<string | undefined>();

    const showUploadFooter = ({ folderName }: { folderName?: string }) => {
        setUploadTargetFolderName(folderName);
    };

    const hideUploadFooter = () => {
        setUploadTargetFolderName(undefined);
    };

    const dataGridProps = useDataGridRemote({ pageSize: 20 });

    const { data: currentFolderData } = useQuery<GQLDamFolderQuery, GQLDamFolderQueryVariables>(damFolderQuery, {
        variables: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: currentFolderId!,
        },
        skip: currentFolderId === undefined,
    });

    const {
        data: dataGridData,
        loading,
        error,
    } = useQuery<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>(damItemsListQuery, {
        variables: {
            folderId: currentFolderId,
            includeArchived: filterApi.current.archived,
            filter: {
                mimetypes: props.allowedMimetypes,
                searchText: filterApi.current.searchText,
            },
            sortColumnName: filterApi.current.sort?.columnName,
            sortDirection: filterApi.current.sort?.direction,
            limit: dataGridProps.pageSize,
            offset: dataGridProps.page * dataGridProps.pageSize,
        },
    });

    const { matches } = useDamSearchHighlighting({
        items: dataGridData?.damItemsList.nodes ?? [],
        query: filterApi.current.searchText ?? "",
    });
    const isSearching = !!(filterApi.current.searchText && filterApi.current.searchText.length > 0);

    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();

    const fileUploadApi = useFileUpload({
        acceptedMimetypes: props.allowedMimetypes ?? allAcceptedMimeTypes,
        onAfterUpload: () => {
            apolloClient.reFetchObservableQueries();
            clearDamItemCache(apolloClient.cache);
        },
    });

    React.useEffect(() => {
        async function navigateToNewlyUploadedItems() {
            if (fileUploadApi.newlyUploadedItemIds.length === 0) {
                return;
            }

            let type: GQLDamItemTypeLiteral | undefined;
            let id: string | undefined;
            let parentId: string | undefined;
            let redirectToSubfolder;

            if (fileUploadApi.newlyUploadedItemIds.find((item) => item.type === "folder")) {
                const folders = fileUploadApi.newlyUploadedItemIds.filter((item) => item.type === "folder");
                const firstFolder = folders[0];

                type = "Folder";
                id = firstFolder.id;

                if (firstFolder.parentId === currentFolderId) {
                    // upload to current folder / creates new folders
                    parentId = currentFolderId;
                    redirectToSubfolder = false;
                } else {
                    // upload to subfolder / creates new folders
                    parentId = firstFolder.parentId;
                    redirectToSubfolder = true;
                }
            } else {
                const files = fileUploadApi.newlyUploadedItemIds;
                const firstFile = files[0];

                type = "File";
                id = firstFile.id;

                if (firstFile.parentId === currentFolderId) {
                    // upload to current folder / creates NO new folders (only files)
                    parentId = currentFolderId;
                    redirectToSubfolder = false;
                } else {
                    // upload to subfolder / creates NO new folders (only files)
                    parentId = firstFile.parentId;
                    redirectToSubfolder = true;
                }
            }

            const result = await apolloClient.query<GQLDamItemListPositionQuery, GQLDamItemListPositionQueryVariables>({
                query: damItemListPosition,
                variables: {
                    id: id,
                    type: type,
                    folderId: parentId,
                    includeArchived: filterApi.current.archived,
                    filter: {
                        mimetypes: props.allowedMimetypes,
                        searchText: filterApi.current.searchText,
                    },
                    sortColumnName: filterApi.current.sort?.columnName,
                    sortDirection: filterApi.current.sort?.direction,
                },
            });

            const position = result.data.damItemListPosition;
            const targetPage = Math.floor(position / dataGridProps.pageSize);

            if (redirectToSubfolder && parentId) {
                switchApi.activatePage("folder", parentId);
            } else {
                dataGridProps.onPageChange?.(targetPage, {});
            }
        }

        navigateToNewlyUploadedItems();

        // useEffect dependencies must only include `newlyUploadedItemIds`, because the function should only be called once after new items are added.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileUploadApi.newlyUploadedItemIds]);

    const [hoveredId, setHoveredId] = React.useState<string | null>(null);

    const showHoverStyles = useDebouncedCallback(
        (id = "root") => {
            setHoveredId(id);
        },
        500,
        { leading: true },
    );

    const hideHoverStyles = () => {
        if (showHoverStyles.isPending()) {
            showHoverStyles.cancel();
        }
        setHoveredId(null);
    };

    // handles upload of native file (e.g. file from desktop) to current folder:
    // If the native file is dropped on a file row in the DataGrid, it is uploaded
    // to the current folder
    const { getRootProps: getFileRootProps } = useDropzone({
        ...fileUploadApi.dropzoneConfig,
        noClick: true,
        onDragOver: () => {
            showHoverStyles();
            showUploadFooter({
                folderName:
                    currentFolderData?.damFolder.name ??
                    intl.formatMessage({
                        id: "comet.dam.footer.assetManager",
                        defaultMessage: "Asset Manager",
                    }),
            });
        },
        onDragLeave: () => {
            hideHoverStyles();
            hideUploadFooter();
        },
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            hideHoverStyles();
            hideUploadFooter();
            await fileUploadApi.uploadFiles({ acceptedFiles, fileRejections }, currentFolderId);
        },
    });

    const [moveDamItemDialogState, setMoveDamItemDialogState] = React.useState<"selection" | "single" | null>(null);
    const [moveSingleDamItem, setMoveSingleDamItem] = React.useState<{ id: string; type: "file" | "folder" } | null>(null);

    const onMoveSingleDamItem = (id: string, type: "file" | "folder") => {
        setMoveSingleDamItem({ id, type });
        setMoveDamItemDialogState("single");
    };

    return (
        <div style={{ padding: "20px" }}>
            <FolderHead
                isSearching={isSearching}
                numberItems={dataGridData?.damItemsList.totalCount ?? 0}
                breadcrumbs={breadcrumbs}
                folderId={currentFolderId}
                folderName={
                    currentFolderId === undefined ? (
                        <FormattedMessage id="comet.pages.dam.assetManager" defaultMessage="Asset Manager" />
                    ) : (
                        currentFolderData?.damFolder.name
                    )
                }
                TableHeadActionButton={TableHeadActionButton}
            />
            <sc.FolderOuterHoverHighlight isHovered={hoveredId === "root"} {...getFileRootProps()}>
                <DataGrid
                    {...dataGridProps}
                    rowHeight={58}
                    rows={dataGridData?.damItemsList.nodes ?? []}
                    rowCount={dataGridData?.damItemsList.totalCount ?? 0}
                    loading={loading}
                    error={error}
                    rowsPerPageOptions={[10, 20, 50]}
                    getRowClassName={({ row }) => {
                        if (fileUploadApi.newlyUploadedItemIds.find((newItem) => newItem.id === row.id)) {
                            return "CometDataGridRow--highlighted";
                        }

                        return "";
                    }}
                    columns={[
                        {
                            field: "name",
                            headerName: intl.formatMessage({
                                id: "comet.dam.file.name",
                                defaultMessage: "Name",
                            }),
                            flex: 1,
                            renderCell: ({ row }) => {
                                return (
                                    <DamItemLabelColumn
                                        item={row}
                                        renderDamLabel={renderDamLabel}
                                        matches={matches}
                                        filterApi={filterApi}
                                        isSearching={isSearching}
                                        fileUploadApi={fileUploadApi}
                                        footerApi={{
                                            show: showUploadFooter,
                                            hide: hideUploadFooter,
                                        }}
                                        hoverApi={{
                                            showHoverStyles,
                                            hideHoverStyles,
                                            isHovered: hoveredId === row.id,
                                        }}
                                    />
                                );
                            },
                            sortable: false,
                            hideSortIcons: true,
                            disableColumnMenu: true,
                        },
                        {
                            field: "size",
                            headerName: intl.formatMessage({
                                id: "comet.dam.file.size",
                                defaultMessage: "Size",
                            }),
                            headerAlign: "right",
                            align: "right",
                            minWidth: 100,
                            renderCell: ({ row }) => {
                                if (isFile(row)) {
                                    return <PrettyBytes value={row.size} />;
                                } else {
                                    return (
                                        <FormattedMessage
                                            id="comet.dam.folderSize"
                                            defaultMessage="{number} {number, plural, one {item} other {items}}"
                                            values={{
                                                number: row.numberOfFiles + row.numberOfChildFolders,
                                            }}
                                        />
                                    );
                                }
                            },
                            sortable: false,
                            hideSortIcons: true,
                            disableColumnMenu: true,
                        },
                        {
                            field: "updatedAt",
                            headerName: intl.formatMessage({
                                id: "comet.dam.file.changeDate",
                                defaultMessage: "Change date",
                            }),
                            headerAlign: "right",
                            align: "right",
                            minWidth: 180,
                            renderCell: ({ row }) => (
                                <div>
                                    <FormattedDate value={row.updatedAt} day="2-digit" month="2-digit" year="numeric" />
                                    {", "}
                                    <FormattedTime value={row.updatedAt} />
                                </div>
                            ),
                            sortable: false,
                            hideSortIcons: true,
                            disableColumnMenu: true,
                        },
                        {
                            field: "contextMenu",
                            headerName: "",
                            align: "center",
                            renderCell: ({ row }) => {
                                return isFile(row) ? (
                                    <DamContextMenu file={row} onMove={onMoveSingleDamItem} />
                                ) : (
                                    <DamContextMenu folder={row} onMove={onMoveSingleDamItem} />
                                );
                            },
                            renderHeader: () => null,
                            sortable: false,
                            hideSortIcons: true,
                            disableColumnMenu: true,
                            hide: hideContextMenu,
                        },
                    ]}
                    checkboxSelection={!hideMultiselect}
                    disableSelectionOnClick
                    selectionModel={Array.from(selectionMap.keys())}
                    onSelectionModelChange={(newSelectionModel) => {
                        const newMap: DamItemSelectionMap = new Map();

                        newSelectionModel.forEach((selectedId) => {
                            const typedId = selectedId as string;

                            if (selectionMap.has(typedId)) {
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                newMap.set(typedId, selectionMap.get(typedId)!);
                            } else {
                                const item = dataGridData?.damItemsList.nodes.find((item) => item.id === typedId);

                                if (!item) {
                                    throw new Error("Selected item does not exist");
                                }

                                let type: "file" | "folder";
                                if (item && isFolder(item)) {
                                    type = "folder";
                                } else {
                                    type = "file";
                                }
                                newMap.set(typedId, type);
                            }
                        });

                        setSelectionMap(newMap);
                    }}
                    autoHeight={true}
                />
            </sc.FolderOuterHoverHighlight>
            <DamSelectionFooter
                open={selectionMap.size > 0}
                selectedItemsMap={selectionMap}
                onOpenMoveDialog={() => {
                    setMoveDamItemDialogState("selection");
                }}
            />
            <DamUploadFooter open={Boolean(uploadTargetFolderName)} folderName={uploadTargetFolderName} />
            <EditDialog
                title={{
                    edit: <FormattedMessage id="comet.dam.folderEditDialog.renameFolder" defaultMessage="Rename folder" />,
                    add: <FormattedMessage id="comet.dam.folderEditDialog.addFolder" defaultMessage="Add folder" />,
                }}
            >
                {({ selectedId, selectionMode }) => {
                    return (
                        <>
                            {selectionMode === "add" && <AddFolder parentId={selectedId} selectionApi={selectionApi} />}
                            {selectionMode === "edit" && <EditFolder id={selectedId as string} selectionApi={selectionApi} />}
                        </>
                    );
                }}
            </EditDialog>
            <MoveDamItemDialog
                open={moveDamItemDialogState !== null}
                onClose={() => {
                    setMoveDamItemDialogState(null);
                }}
                onChooseFolder={async (targetFolderId) => {
                    setMoveDamItemDialogState(null);

                    let fileIds: string[] = [];
                    let folderIds: string[] = [];

                    if (moveDamItemDialogState === "selection") {
                        fileIds = Array.from(selectionMap.entries())
                            .filter(([, type]) => type === "file")
                            .map(([id]) => id);

                        folderIds = Array.from(selectionMap.entries())
                            .filter(([, type]) => type === "folder")
                            .map(([id]) => id);
                    } else if (moveDamItemDialogState === "single" && moveSingleDamItem) {
                        if (moveSingleDamItem.type == "file") {
                            fileIds.push(moveSingleDamItem.id);
                        } else {
                            folderIds.push(moveSingleDamItem.id);
                        }
                    }

                    const mutations: Array<Promise<FetchResult>> = [];

                    if (fileIds.length > 0) {
                        mutations.push(
                            apolloClient.mutate<GQLMoveDamFilesMutation, GQLMoveDamFilesMutationVariables>({
                                mutation: moveDamFilesMutation,
                                variables: {
                                    fileIds,
                                    targetFolderId: targetFolderId,
                                },
                            }),
                        );
                    }

                    if (folderIds.length > 0) {
                        mutations.push(
                            apolloClient.mutate<GQLMoveDamFoldersMutation, GQLMoveDamFoldersMutationVariables>({
                                mutation: moveDamFoldersMutation,
                                variables: {
                                    folderIds,
                                    targetFolderId: targetFolderId,
                                },
                            }),
                        );
                    }

                    await Promise.all(mutations);

                    // await apolloClient.refetchQueries({ include: [namedOperations.Query.DamItemsList] });
                    clearDamItemCache(apolloClient.cache);
                }}
                numSelectedItems={moveDamItemDialogState === "selection" ? selectionMap.size : 1}
            />
            {fileUploadApi.dialogs}
        </div>
    );
};
