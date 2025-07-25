import { useApolloClient, useQuery } from "@apollo/client";
import {
    type BreadcrumbItem,
    DataGridToolbar,
    EditDialog,
    FillSpace,
    GridCellContent,
    type GridColDef,
    type IFilterApi,
    type ISelectionApi,
    PrettyBytes,
    ToolbarActions,
    ToolbarItem,
    useDataGridRemote,
    useSnackbarApi,
    useStackSwitchApi,
    useStoredState,
} from "@comet/admin";
import { DialogContent, Slide, type SlideProps, Snackbar } from "@mui/material";
import { DataGrid, type GridRowClassNameParams, type GridRowSelectionModel, type GridSlotsComponent, useGridApiRef } from "@mui/x-data-grid";
import { type ReactNode, useEffect, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import { useDebouncedCallback } from "use-debounce";

import { type GQLDamItemType } from "../../graphql.generated";
import { useDamConfig } from "../config/damConfig";
import { useDamAcceptedMimeTypes } from "../config/useDamAcceptedMimeTypes";
import { useDamScope } from "../config/useDamScope";
import { type DamConfig, type DamFilter } from "../DamTable";
import { licenseTypeLabels } from "../FileForm/licenseType";
import AddFolder from "../FolderForm/AddFolder";
import EditFolder from "../FolderForm/EditFolder";
import { isFile } from "../helpers/isFile";
import { isFolder } from "../helpers/isFolder";
import { MoveDamItemDialog } from "../MoveDamItemDialog/MoveDamItemDialog";
import DamContextMenu from "./DamContextMenu";
import { UploadFilesButton } from "./fileUpload/UploadFilesButton";
import { useDamFileUpload } from "./fileUpload/useDamFileUpload";
import { DamTableFilter } from "./filter/DamTableFilter";
import { damFolderQuery, damItemListPosition, damItemsListQuery } from "./FolderDataGrid.gql";
import {
    type GQLDamFileTableFragment,
    type GQLDamFolderQuery,
    type GQLDamFolderQueryVariables,
    type GQLDamFolderTableFragment,
    type GQLDamItemListPositionQuery,
    type GQLDamItemListPositionQueryVariables,
    type GQLDamItemsListQuery,
    type GQLDamItemsListQueryVariables,
} from "./FolderDataGrid.gql.generated";
import * as sc from "./FolderDataGrid.sc";
import { DamUploadFooter } from "./footer/UploadFooter";
import { DamItemLabelColumn } from "./label/DamItemLabelColumn";
import { DamMoreActions } from "./selection/DamMoreActions";
import { useDamSelectionApi } from "./selection/DamSelectionContext";
import { LicenseValidityTags } from "./tags/LicenseValidityTags";
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
    renderWithFullHeightMainContent?: boolean;
}

type FolderDataGridToolbarProps = {
    id?: string;
    filterApi: IFilterApi<DamFilter>;
    hideArchiveFilter?: boolean;
    additionalToolbarItems?: ReactNode;
    uploadFilters: {
        allowedMimetypes?: string[];
    };
};

function FolderDataGridToolbar({
    id: currentFolderId,
    filterApi,
    hideArchiveFilter,
    additionalToolbarItems,
    uploadFilters,
}: FolderDataGridToolbarProps) {
    const { data } = useQuery<GQLDamFolderQuery, GQLDamFolderQueryVariables>(damFolderQuery, {
        variables: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: currentFolderId!,
        },
        skip: currentFolderId === undefined,
    });

    return (
        <DataGridToolbar>
            <ToolbarItem>
                <DamTableFilter hideArchiveFilter={hideArchiveFilter} filterApi={filterApi} />
            </ToolbarItem>
            <FillSpace />
            <ToolbarActions>
                {additionalToolbarItems}
                <DamMoreActions
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                    }}
                    folderId={data?.damFolder.id}
                    filter={uploadFilters}
                />

                <UploadFilesButton folderId={data?.damFolder.id} filter={uploadFilters} />
            </ToolbarActions>
        </DataGridToolbar>
    );
}

const FolderDataGrid = ({
    id: currentFolderId,
    filterApi,
    breadcrumbs,
    selectionApi,
    hideContextMenu = false,
    hideArchiveFilter,
    hideMultiselect,
    renderDamLabel,
    renderWithFullHeightMainContent,
    ...props
}: FolderDataGridProps) => {
    const intl = useIntl();
    const apolloClient = useApolloClient();
    const switchApi = useStackSwitchApi();
    const damSelectionActionsApi = useDamSelectionApi();
    const scope = useDamScope();
    const snackbarApi = useSnackbarApi();
    const { importSources, enableLicenseFeature } = useDamConfig();

    const [redirectedToId, setRedirectedToId] = useStoredState<string | null>("FolderDataGrid-redirectedToId", null, window.sessionStorage);

    const [uploadTargetFolderName, setUploadTargetFolderName] = useState<string | undefined>();

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

    const apiRef = useGridApiRef();

    const { data: dataGridData, loading } = useQuery<GQLDamItemsListQuery, GQLDamItemsListQueryVariables>(damItemsListQuery, {
        variables: {
            folderId: currentFolderId,
            includeArchived: filterApi.current.archived,
            filter: {
                mimetypes: props.allowedMimetypes,
                searchText: filterApi.current.searchText,
            },
            sortColumnName: filterApi.current.sort?.columnName,
            sortDirection: filterApi.current.sort?.direction,
            limit: dataGridProps.paginationModel.pageSize,
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            scope,
        },
    });

    const { matches } = useDamSearchHighlighting({
        items: dataGridData?.damItemsList.nodes ?? [],
        query: filterApi.current.searchText ?? "",
    });
    const isSearching = !!(filterApi.current.searchText && filterApi.current.searchText.length > 0);

    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();

    const fileUploadApi = useDamFileUpload({
        acceptedMimetypes: props.allowedMimetypes ?? allAcceptedMimeTypes,
    });

    useEffect(() => {
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
            const targetPage = Math.floor(position / dataGridProps.paginationModel.pageSize);

            if (redirectToSubfolder && id !== redirectedToId && parentId && parentId !== currentFolderId) {
                switchApi.activatePage("folder", parentId);
            } else {
                apiRef.current?.setPaginationModel({ page: targetPage, pageSize: dataGridProps.paginationModel.pageSize });
            }

            setRedirectedToId(id);
        }

        navigateToNewlyUploadedItems();

        // useEffect dependencies must only include `newlyUploadedItems`, because the function should only be called once after new items are added.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileUploadApi.newlyUploadedItems]);

    const [hoveredId, setHoveredId] = useState<string | null>(null);

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
            message={<FormattedMessage id="comet.dam.upload.noEmptyFolders" defaultMessage="Empty folders can't be uploaded" />}
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

            await fileUploadApi.uploadFiles({ acceptedFiles, fileRejections }, { folderId: currentFolderId });

            // react-dropzone doesn't support folder drops natively
            // the only way to find out if an empty folder was dropped is if there are no rejected files and no accepted files
            if (!fileRejections.length && !acceptedFiles.length) {
                snackbarApi.showSnackbar(emptyFolderSnackbarElement);
            }
        },
    });

    const [damItemToMove, setDamItemToMove] = useState<{ id: string; type: "file" | "folder" }>();
    const moveDialogOpen = damItemToMove !== undefined;

    const openMoveDialog = (itemToMove: { id: string; type: "file" | "folder" }) => {
        setDamItemToMove(itemToMove);
    };

    const closeMoveDialog = () => {
        setDamItemToMove(undefined);
    };

    const handleSelectionModelChange = (newSelectionModel: GridRowSelectionModel) => {
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

    const dataGridColumns: GridColDef<GQLDamFileTableFragment | GQLDamFolderTableFragment>[] = [
        {
            field: "name",
            headerName: intl.formatMessage({
                id: "comet.dam.file.name",
                defaultMessage: "Name",
            }),
            flex: 1,
            minWidth: 300,
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
            field: "importSourceType",
            headerName: intl.formatMessage({
                id: "comet.dam.file.importSourceType",
                defaultMessage: "Source",
            }),
            renderCell: ({ row }) => {
                if (isFile(row) && row.importSourceType && importSources?.[row.importSourceType]) {
                    return importSources[row.importSourceType].label;
                }
            },
            // TODO enable sorting/filtering in API
            sortable: false,
            hideSortIcons: true,
            disableColumnMenu: true,
        },
        {
            field: "type",
            headerName: intl.formatMessage({
                id: "comet.dam.file.fileType",
                defaultMessage: "Type/Format",
            }),
            headerAlign: "left",
            align: "left",
            minWidth: 140,
            renderCell: ({ row }) => {
                if (isFile(row) && row.mimetype) {
                    return row.mimetype;
                } else if (isFolder(row)) {
                    return intl.formatMessage({
                        id: "comet.dam.file.fileType.folder",
                        defaultMessage: "Folder",
                    });
                }
            },
            sortable: false,
            hideSortIcons: true,
            disableColumnMenu: true,
        },
        {
            field: "info",
            headerName: intl.formatMessage({
                id: "comet.dam.file.info",
                defaultMessage: "Info",
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
        ...(enableLicenseFeature
            ? ([
                  {
                      field: "license",
                      headerName: intl.formatMessage({
                          id: "comet.dam.file.license",
                          defaultMessage: "License",
                      }),
                      headerAlign: "left",
                      align: "left",
                      minWidth: 200,
                      renderCell: ({ row }) => {
                          if (isFile(row) && row.license && row.license.type) {
                              return (
                                  <GridCellContent
                                      primaryText={licenseTypeLabels[row.license.type]}
                                      secondaryText={
                                          row.license.expiresWithinThirtyDays || row.license.hasExpired ? (
                                              <LicenseValidityTags
                                                  {...row.license}
                                                  expirationDate={row.license.expirationDate ? new Date(row.license.expirationDate) : undefined}
                                              />
                                          ) : (
                                              <>
                                                  <FormattedMessage id="comet.dam.file.license.validUntil" defaultMessage="Valid until:" />{" "}
                                                  {row.license.durationTo ? (
                                                      <FormattedDate value={row.license.durationTo} dateStyle="medium" />
                                                  ) : (
                                                      <FormattedMessage id="comet.dam.file.license.unlimited" defaultMessage="Unlimited" />
                                                  )}
                                              </>
                                          )
                                      }
                                  />
                              );
                          }
                      },
                      sortable: false,
                      hideSortIcons: true,
                      disableColumnMenu: true,
                  },
              ] satisfies GridColDef<GQLDamFileTableFragment | GQLDamFolderTableFragment>[])
            : []),
        {
            field: "createdAt",
            headerName: intl.formatMessage({
                id: "comet.dam.file.creationDate",
                defaultMessage: "Creation",
            }),
            headerAlign: "left",
            align: "left",
            minWidth: 180,
            valueFormatter: (value) => (value ? intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }) : ""),
            sortable: false,
            hideSortIcons: true,
            disableColumnMenu: true,
        },
        {
            field: "updatedAt",
            headerName: intl.formatMessage({
                id: "comet.dam.file.changeDate",
                defaultMessage: "Latest change",
            }),
            headerAlign: "left",
            align: "left",
            minWidth: 180,
            valueFormatter: (value) => (value ? intl.formatDate(value, { dateStyle: "medium", timeStyle: "short" }) : ""),
            sortable: false,
            hideSortIcons: true,
            disableColumnMenu: true,
        },
        {
            field: "actions",
            headerName: "",
            type: "actions",
            align: "right",
            pinned: "right",
            width: 52,
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
        },
    ];

    const uploadFilters = {
        allowedMimetypes: props.allowedMimetypes,
    };

    return (
        <>
            <sc.FolderOuterHoverHighlight isHovered={hoveredId === "root"} {...getFileRootProps()}>
                <DataGrid
                    apiRef={apiRef}
                    {...dataGridProps}
                    rowHeight={58}
                    rows={dataGridData?.damItemsList.nodes ?? []}
                    rowCount={dataGridData?.damItemsList.totalCount ?? undefined}
                    loading={loading}
                    pageSizeOptions={[10, 20, 50]}
                    getRowClassName={getRowClassName}
                    columns={dataGridColumns}
                    checkboxSelection={!hideMultiselect}
                    rowSelectionModel={Array.from(damSelectionActionsApi.selectionMap.keys())}
                    onRowSelectionModelChange={handleSelectionModelChange}
                    autoHeight={!renderWithFullHeightMainContent}
                    initialState={{ columns: { columnVisibilityModel: { importSourceType: importSources !== undefined } } }}
                    columnVisibilityModel={{
                        contextMenu: !hideContextMenu,
                    }}
                    slots={{
                        toolbar: FolderDataGridToolbar as GridSlotsComponent["toolbar"],
                    }}
                    slotProps={{
                        toolbar: {
                            id: currentFolderId,
                            breadcrumbs,
                            filterApi,
                            selectionApi,
                            uploadFilters,
                            additionalToolbarItems: props.additionalToolbarItems,
                        } as FolderDataGridToolbarProps,
                    }}
                />
            </sc.FolderOuterHoverHighlight>
            <DamUploadFooter open={Boolean(uploadTargetFolderName)} folderName={uploadTargetFolderName} />
            <EditDialog
                title={{
                    edit: <FormattedMessage id="comet.dam.folderEditDialog.renameFolder" defaultMessage="Rename folder" />,
                    add: <FormattedMessage id="comet.dam.folderEditDialog.addFolder" defaultMessage="Add folder" />,
                }}
            >
                {({ selectedId, selectionMode }) => {
                    return (
                        <DialogContent>
                            {selectionMode === "add" && <AddFolder parentId={selectedId} selectionApi={selectionApi} />}
                            {selectionMode === "edit" && <EditFolder id={selectedId as string} selectionApi={selectionApi} />}
                        </DialogContent>
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
        </>
    );
};

export default FolderDataGrid;
