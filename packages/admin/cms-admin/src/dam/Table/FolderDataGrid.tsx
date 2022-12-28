import { useApolloClient, useQuery } from "@apollo/client";
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
import { useDebouncedCallback } from "use-debounce";

import { GQLDamFolderQuery, GQLDamFolderQueryVariables, GQLDamItemsListQuery, GQLDamItemsListQueryVariables } from "../../graphql.generated";
import { useDamAcceptedMimeTypes } from "../config/useDamAcceptedMimeTypes";
import { DamConfig, DamFilter } from "../DamTable";
import AddFolder from "../FolderForm/AddFolder";
import EditFolder from "../FolderForm/EditFolder";
import DamContextMenu from "./DamContextMenu";
import { useFileUpload } from "./fileUpload/useFileUpload";
import * as sc from "./FolderDataGrid.sc";
import { damFolderQuery, damItemsListQuery } from "./FolderTable.gql";
import { isFile } from "./FolderTableRow";
import { NameColumn } from "./NameColumn";
import { TableHead } from "./TableHead";
import { useDamSearchHighlighting } from "./useDamSearchHighlighting";

interface FolderDataGridProps extends DamConfig {
    id?: string;
    breadcrumbs?: BreadcrumbItem[];
    filterApi: IFilterApi<DamFilter>;
    selectionApi: ISelectionApi;
}

const FolderDataGrid = ({
    id,
    filterApi,
    breadcrumbs,
    selectionApi,
    hideContextMenu,
    hideArchiveFilter,
    renderDamLabel,
    TableContainer: ConfigTableContainer,
    ...props
}: FolderDataGridProps): React.ReactElement => {
    const intl = useIntl();
    const apolloClient = useApolloClient();

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
            apolloClient.cache.evict({ id: "ROOT_QUERY", fieldName: "damItemsList" });
        },
    });

    const [isHovered, setIsHovered] = React.useState<boolean>(false);

    const showHoverStyles = useDebouncedCallback(
        () => {
            setIsHovered(true);
        },
        500,
        { leading: true },
    );

    const hideHoverStyles = () => {
        if (showHoverStyles.isPending()) {
            showHoverStyles.cancel();
        }
        setIsHovered(false);
    };

    // handles upload of native file (e.g. file from desktop) to current folder:
    // If the native file is dropped on a file row in the table, it is uploaded
    // to the current folder
    const { getRootProps: getFileRootProps } = useDropzone({
        ...fileUploadApi.dropzoneConfig,
        noClick: true,
        onDragEnter: (event) => {
            console.log("outer onDragOver ", event);
            showHoverStyles();
            // showFooter("upload", data?.damFolder.name);
        },
        onDragLeave: () => {
            hideHoverStyles();
            // hideFooter();
        },
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            hideHoverStyles();
            // hideFooter();
            await fileUploadApi.uploadFiles({ acceptedFiles, fileRejections }, data?.damFolder.id);
        },
    });

    return (
        <div style={{ padding: "20px" }}>
            <TableHead isSearching={isSearching} numberItems={tableData?.totalCount ?? 0} breadcrumbs={breadcrumbs} folderId={id} />
            <sc.FolderOuterHoverHighlight isHovered={isHovered} {...getFileRootProps()}>
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
                                    <NameColumn
                                        item={row}
                                        renderDamLabel={renderDamLabel}
                                        matches={matches}
                                        filterApi={filterApi}
                                        isSearching={isSearching}
                                        fileUploadApi={fileUploadApi}
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
                                return isFile(row) ? <DamContextMenu file={row} /> : <DamContextMenu folder={row} />;
                            },
                            renderHeader: () => null,
                            sortable: false,
                            hideSortIcons: true,
                            disableColumnMenu: true,
                        },
                    ]}
                    checkboxSelection
                    disableSelectionOnClick
                    autoHeight={true}
                />
            </sc.FolderOuterHoverHighlight>
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
            {fileUploadApi.dialogs}
        </div>
    );
};

export default FolderDataGrid;
