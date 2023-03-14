import { useApolloClient, useQuery } from "@apollo/client";
import { BreadcrumbItem, EditDialog, IFilterApi, ISelectionApi, PrettyBytes, useDataGridRemote } from "@comet/admin";
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
import { clearDamItemCache } from "../helpers/clearDamItemCache";
import { isFile } from "../helpers/isFile";
import { isFolder } from "../helpers/isFolder";
import { MoveDamItemDialog } from "../MoveDamItemDialog/MoveDamItemDialog";
import DamContextMenu from "./DamContextMenu";
import { useFileUpload } from "./fileUpload/useFileUpload";
import { damFolderQuery, damItemsListQuery } from "./FolderDataGrid.gql";
import * as sc from "./FolderDataGrid.sc";
import { FolderHead } from "./FolderHead";
import { DamSelectionFooter } from "./footer/SelectionFooter";
import { DamUploadFooter } from "./footer/UploadFooter";
import { DamItemLabelColumn } from "./label/DamItemLabelColumn";
import { useDamSelectionApi } from "./selection/DamSelectionContext";
import { useDamSearchHighlighting } from "./useDamSearchHighlighting";

export type DamItemSelectionMap = Map<string, "file" | "folder">;

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
    hideMultiselect,
    renderDamLabel,
    ...props
}: FolderDataGridProps): React.ReactElement => {
    const intl = useIntl();
    const apolloClient = useApolloClient();
    const damSelectionActionsApi = useDamSelectionApi();

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
            id: id!,
        },
        skip: id === undefined,
    });

    const {
        data: dataGridData,
        loading,
        error,
    } = useQuery<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>(damItemsListQuery, {
        variables: {
            folderId: id,
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
            await fileUploadApi.uploadFiles({ acceptedFiles, fileRejections }, currentFolderData?.damFolder.id);
        },
    });

    const [damItemToMove, setDamItemToMove] = React.useState<{ id: string; type: "file" | "folder" }>();
    const moveDialogOpen = damItemToMove !== undefined;

    const openMoveDialog = (itemToMove: { id: string; type: "file" | "folder" }) => {
        setDamItemToMove(itemToMove);
    };

    const closeMoveDialog = () => {
        setDamItemToMove(undefined);
    };

    return (
        <div style={{ padding: "20px" }}>
            <FolderHead isSearching={isSearching} numberItems={dataGridData?.damItemsList.totalCount ?? 0} breadcrumbs={breadcrumbs} folderId={id} />
            <sc.FolderOuterHoverHighlight isHovered={hoveredId === "root"} {...getFileRootProps()}>
                <DataGrid
                    {...dataGridProps}
                    rowHeight={58}
                    rows={dataGridData?.damItemsList.nodes ?? []}
                    rowCount={dataGridData?.damItemsList.totalCount ?? 0}
                    loading={loading}
                    error={error}
                    rowsPerPageOptions={[10, 20, 50]}
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
                                    <DamContextMenu file={row} openMoveDialog={openMoveDialog} />
                                ) : (
                                    <DamContextMenu folder={row} openMoveDialog={openMoveDialog} />
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
                    selectionModel={Array.from(damSelectionActionsApi.selectionMap.keys())}
                    onSelectionModelChange={(newSelectionModel) => {
                        const newMap: DamItemSelectionMap = new Map();

                        newSelectionModel.forEach((selectedId) => {
                            const typedId = selectedId as string;

                            if (damSelectionActionsApi.selectionMap.has(typedId)) {
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                newMap.set(typedId, damSelectionActionsApi.selectionMap.get(typedId)!);
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

                        damSelectionActionsApi.setSelectionMap(newMap);
                    }}
                    autoHeight={true}
                />
            </sc.FolderOuterHoverHighlight>
            <DamSelectionFooter open={damSelectionActionsApi.selectionMap.size > 0} />
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
            {fileUploadApi.dialogs}
            <MoveDamItemDialog
                damItemsToMove={damItemToMove ? [damItemToMove] : []}
                open={moveDialogOpen}
                onClose={() => {
                    closeMoveDialog();
                }}
            />
        </div>
    );
};

export default FolderDataGrid;
