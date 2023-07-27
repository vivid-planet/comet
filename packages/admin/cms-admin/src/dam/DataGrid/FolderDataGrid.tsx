import { useApolloClient, useQuery } from "@apollo/client";
import {
    BreadcrumbItem,
    EditDialog,
    IFilterApi,
    ISelectionApi,
    PrettyBytes,
    useDataGridRemote,
    useSnackbarApi,
    useStackSwitchApi,
    useStoredState,
} from "@comet/admin";
import { Slide, SlideProps, Snackbar } from "@mui/material";
import { DataGrid, GridColumns, GridRowClassNameParams, GridSelectionModel } from "@mui/x-data-grid";
import * as React from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from "react-intl";
import { useDebouncedCallback } from "use-debounce";

import { GQLDamItemType } from "../../graphql.generated";
import { useDamAcceptedMimeTypes } from "../config/useDamAcceptedMimeTypes";
import { useDamScope } from "../config/useDamScope";
import { DamConfig, DamFilter } from "../DamTable";
import AddFolder from "../FolderForm/AddFolder";
import EditFolder from "../FolderForm/EditFolder";
import { clearDamItemCache } from "../helpers/clearDamItemCache";
import { isFile } from "../helpers/isFile";
import { isFolder } from "../helpers/isFolder";
import { MoveDamItemDialog } from "../MoveDamItemDialog/MoveDamItemDialog";
import DamContextMenu from "./DamContextMenu";
import { useFileUpload } from "./fileUpload/useFileUpload";
import { damFolderQuery, damItemListPosition, damItemsListQuery } from "./FolderDataGrid.gql";
import {
    GQLDamFolderQuery,
    GQLDamFolderQueryVariables,
    GQLDamItemListPositionQuery,
    GQLDamItemListPositionQueryVariables,
    GQLDamItemsListQuery,
    GQLDamItemsListQueryVariables,
} from "./FolderDataGrid.gql.generated";
import * as sc from "./FolderDataGrid.sc";
import { FolderHead } from "./FolderHead";
import { DamSelectionFooter } from "./footer/SelectionFooter";
import { DamUploadFooter } from "./footer/UploadFooter";
import { DamItemLabelColumn } from "./label/DamItemLabelColumn";
import { useDamSelectionApi } from "./selection/DamSelectionContext";
import { useDamSearchHighlighting } from "./useDamSearchHighlighting";
export { damFolderQuery } from "./FolderDataGrid.gql";
export { moveDamFilesMutation, moveDamFoldersMutation } from "./FolderDataGrid.gql";
export {
    GQLDamFileTableFragment,
    GQLDamFolderQuery,
    GQLDamFolderQueryVariables,
    GQLDamFolderTableFragment,
    GQLMoveDamFilesMutation,
    GQLMoveDamFilesMutationVariables,
    GQLMoveDamFoldersMutation,
    GQLMoveDamFoldersMutationVariables,
} from "./FolderDataGrid.gql.generated";

export type DamItemSelectionMap = Map<string, "file" | "folder">;

interface FolderDataGridProps extends DamConfig {
    id?: string;
    breadcrumbs?: BreadcrumbItem[];
    filterApi: IFilterApi<DamFilter>;
    selectionApi: ISelectionApi;
}

const FolderDataGrid = ({
    id: currentFolderId,
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
    const switchApi = useStackSwitchApi();
    const damSelectionActionsApi = useDamSelectionApi();
    const scope = useDamScope();
    const snackbarApi = useSnackbarApi();

    const [redirectedToId, setRedirectedToId] = useStoredState<string | null>("FolderDataGrid-redirectedToId", null, window.sessionStorage);

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
            scope,
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
            if (fileUploadApi.newlyUploadedItems.length === 0) {
                return;
            }

            let type: GQLDamItemType | undefined;
            let id: string | undefined;
            let parentId: string | undefined;
            let redirectToSubfolder;

            if (fileUploadApi.newlyUploadedItems.find((item) => item.type === "folder")) {
                const folders = fileUploadApi.newlyUploadedItems.filter((item) => item.type === "folder");
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
                const files = fileUploadApi.newlyUploadedItems;
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

            if (id === redirectedToId) {
                // otherwise it's not possible to navigate to another folder while the new item is in newlyUploadedItems
                // because it always automatically redirects to the new item
                return;
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
                    scope,
                },
            });

            const position = result.data.damItemListPosition;
            const targetPage = Math.floor(position / dataGridProps.pageSize);

            if (redirectToSubfolder && id !== redirectedToId && parentId && parentId !== currentFolderId) {
                switchApi.activatePage("folder", parentId);
            } else {
                dataGridProps.onPageChange?.(targetPage, {});
            }

            setRedirectedToId(id);
        }

        navigateToNewlyUploadedItems();

        // useEffect dependencies must only include `newlyUploadedItems`, because the function should only be called once after new items are added.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileUploadApi.newlyUploadedItems]);

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

    const emptyFolderSnackbarElement = (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            autoHideDuration={5000}
            TransitionComponent={(props: SlideProps) => <Slide {...props} direction="right" />}
            message={<FormattedMessage id="comet.dam.upload.noEmptyFolders" defaultMessage={"Empty folders can't be uploaded"} />}
        />
    );

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
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[], event) => {
            hideHoverStyles();
            hideUploadFooter();

            await fileUploadApi.uploadFiles({ acceptedFiles, fileRejections }, currentFolderId);

            // react-dropzone doesn't support folder drops natively
            // the only way to find out if an empty folder was dropped is if there are no rejected files and no accepted files
            if (!fileRejections.length && !acceptedFiles.length) {
                snackbarApi.showSnackbar(emptyFolderSnackbarElement);
            }
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

    const handleSelectionModelChange = (newSelectionModel: GridSelectionModel) => {
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
    };

    const getRowClassName = ({ row }: GridRowClassNameParams) => {
        if (fileUploadApi.newlyUploadedItems.find((newItem) => newItem.id === row.id)) {
            return "CometDataGridRow--highlighted";
        }

        if (row.isInboxFromOtherScope) {
            return "CometDataGridRow--inboxFolder";
        }

        return "";
    };

    const dataGridColumns: GridColumns = [
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
                        scrollIntoView={fileUploadApi.newlyUploadedItems[0]?.id === row.id}
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
    ];

    return (
        <div style={{ padding: "20px" }}>
            <FolderHead
                isSearching={isSearching}
                numberItems={dataGridData?.damItemsList.totalCount ?? 0}
                breadcrumbs={breadcrumbs}
                folderId={currentFolderId}
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
                    getRowClassName={getRowClassName}
                    columns={dataGridColumns}
                    checkboxSelection={!hideMultiselect}
                    disableSelectionOnClick
                    selectionModel={Array.from(damSelectionActionsApi.selectionMap.keys())}
                    onSelectionModelChange={handleSelectionModelChange}
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
