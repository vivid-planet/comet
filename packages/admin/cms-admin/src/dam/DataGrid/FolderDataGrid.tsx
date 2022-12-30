import { useApolloClient, useQuery } from "@apollo/client";
import { FetchResult } from "@apollo/client/link/core";
import {
    BreadcrumbItem,
    createOffsetLimitPagingAction,
    EditDialog,
    IFilterApi,
    ISelectionApi,
    PrettyBytes,
    useStoredState,
    useTableQuery,
    useTableQueryPaging,
} from "@comet/admin";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from "react-intl";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";

import {
    GQLDamFolderQuery,
    GQLDamFolderQueryVariables,
    GQLDamItemsListQuery,
    GQLDamItemsListQueryVariables,
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
import { damFolderQuery, damItemsListQuery } from "./FolderDataGrid.gql";
import * as sc from "./FolderDataGrid.sc";
import { DamFooter } from "./footer/DamFooter";
import { DamItemLabelColumn } from "./label/DamItemLabelColumn";
import { MoveDamItemDialog } from "./moveDialog/MoveDamItemDialog";
import { moveDamFilesMutation, moveDamFoldersMutation } from "./moveDialog/MoveDamItemDialog.gql";
import { TableHead } from "./TableHead";
import { useDamSearchHighlighting } from "./useDamSearchHighlighting";

export type FooterType = "upload" | "selection";
interface FooterInfo {
    type: FooterType;

    folderName?: string;
}

export type DamItemSelectionMap = Map<string, "file" | "folder">;

interface FolderDataGridProps extends DamConfig {
    id?: string;
    breadcrumbs?: BreadcrumbItem[];
    filterApi: IFilterApi<DamFilter>;
    selectionApi: ISelectionApi;
}

export const FolderDataGrid = ({
    id,
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

    const [selectionMap, setSelectionMap] = React.useState<DamItemSelectionMap>(new Map());
    const [footerInfo, setFooterInfo] = React.useState<FooterInfo | null>(null);

    const showFooter = useThrottledCallback((type: FooterType, specificInfo?: { folderName?: string }) => {
        setFooterInfo({
            type,
            folderName: specificInfo?.folderName,
        });
    }, 500);

    const hideFooter = React.useCallback(() => {
        if (showFooter.isPending()) {
            showFooter.cancel();
        }

        if (footerInfo?.type === "upload" && selectionMap.size > 0) {
            showFooter("selection");
            return;
        }

        setFooterInfo(null);
    }, [footerInfo?.type, selectionMap.size, showFooter]);

    React.useEffect(() => {
        if (selectionMap.size > 0) {
            showFooter("selection");
        } else {
            hideFooter();
        }

        // useEffect should only be executed if the selection changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectionMap]);

    const [pageSize, setPageSize] = useStoredState<number>("FolderDataGrid-pageSize", 20);
    const pagingApi = useTableQueryPaging(0, { persistedStateId: "FolderDataGrid-pagingApi" });

    const { data } = useQuery<GQLDamFolderQuery, GQLDamFolderQueryVariables>(damFolderQuery, {
        variables: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: id!,
        },
        skip: id === undefined,
    });

    const {
        tableData,
        loading: tableLoading,
        error,
    } = useTableQuery<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>()(damItemsListQuery, {
        variables: {
            folderId: id,
            includeArchived: filterApi.current.archived,
            filter: {
                mimetypes: props.allowedMimetypes,
                searchText: filterApi.current.searchText,
            },
            sortColumnName: filterApi.current.sort?.columnName,
            sortDirection: filterApi.current.sort?.direction,
            limit: pageSize,
            offset: pagingApi.current,
        },
        resolveTableData: (data) => {
            return {
                data: data.damItemsList.nodes,
                totalCount: data.damItemsList.totalCount,
                pagingInfo: createOffsetLimitPagingAction(pagingApi, { totalCount: data.damItemsList.totalCount }, pageSize),
            };
        },
    });

    const { matches } = useDamSearchHighlighting({
        items: tableData?.data ?? [],
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
    // If the native file is dropped on a file row in the table, it is uploaded
    // to the current folder
    const { getRootProps: getFileRootProps } = useDropzone({
        ...fileUploadApi.dropzoneConfig,
        noClick: true,
        onDragOver: () => {
            showHoverStyles();
            showFooter("upload", {
                folderName: data?.damFolder.name,
            });
        },
        onDragLeave: () => {
            hideHoverStyles();
            hideFooter();
        },
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            hideHoverStyles();
            hideFooter();
            await fileUploadApi.uploadFiles({ acceptedFiles, fileRejections }, data?.damFolder.id);
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
            <TableHead
                isSearching={isSearching}
                numberItems={tableData?.totalCount ?? 0}
                breadcrumbs={breadcrumbs}
                folderId={id}
                folderName={
                    id === undefined ? <FormattedMessage id="comet.pages.dam.assetManager" defaultMessage="Asset Manager" /> : data?.damFolder.name
                }
                TableHeadActionButton={TableHeadActionButton}
            />
            <sc.FolderOuterHoverHighlight isHovered={hoveredId === "root"} {...getFileRootProps()}>
                <DataGrid
                    rowHeight={58}
                    rows={tableData?.data ?? []}
                    rowCount={tableData?.totalCount ?? 0}
                    loading={tableLoading}
                    error={error}
                    rowsPerPageOptions={[10, 20, 50]}
                    pagination
                    page={pagingApi.currentPage ? pagingApi.currentPage - 1 : 0}
                    pageSize={pageSize}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                        const currentPage = pagingApi.currentPage ? pagingApi.currentPage - 1 : 0;

                        if (newPage > currentPage) {
                            tableData?.pagingInfo.fetchNextPage?.();
                        } else {
                            tableData?.pagingInfo.fetchPreviousPage?.();
                        }
                    }}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
                                            show: showFooter,
                                            hide: hideFooter,
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
                                const item = tableData?.data.find((item) => item.id === typedId);

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
            <DamFooter
                open={!!footerInfo?.type}
                type={footerInfo?.type}
                folderName={footerInfo?.folderName}
                selectedItemsMap={selectionMap}
                onOpenMoveDialog={() => {
                    setMoveDamItemDialogState("selection");
                }}
            />
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
