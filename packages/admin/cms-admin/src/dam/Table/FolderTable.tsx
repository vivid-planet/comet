import { useApolloClient, useQuery } from "@apollo/client";
import {
    BreadcrumbItem,
    createRelayPagingActions,
    EditDialog,
    IFilterApi,
    IRelayPagingVariables,
    ISelectionApi,
    ITableColumn,
    MainContent,
    PrettyBytes,
    Table,
    TableColumns,
    useTableQuery,
    useTableQueryPaging,
} from "@comet/admin";
import { StackLink } from "@comet/admin/lib/stack/StackLink";
import { Link } from "@mui/material";
import * as React from "react";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { FileRejection, useDropzone } from "react-dropzone";
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from "react-intl";
import { useDebouncedCallback, useThrottledCallback } from "use-debounce";

import {
    GQLDamFileTableFragment,
    GQLDamFolderQuery,
    GQLDamFolderQueryVariables,
    GQLDamFolderTableFragment,
    GQLDamItemCursor,
    GQLDamItemsListQuery,
    GQLDamItemsListQueryVariables,
    GQLPaginatedDamItems,
} from "../../graphql.generated";
import { useDamAcceptedMimeTypes } from "../config/useDamAcceptedMimeTypes";
import { DamConfig, DamFilter } from "../DamTable";
import AddFolder from "../FolderForm/AddFolder";
import EditFolder from "../FolderForm/EditFolder";
import { DamActions } from "./damActions/DamActions";
import DamContextMenu from "./DamContextMenu";
import { DamDnDFooter, FooterType } from "./DamDnDFooter";
import DamLabel from "./DamLabel";
import { useFileUpload } from "./fileUpload/useFileUpload";
import { damFolderQuery, damItemsListQuery } from "./FolderTable.gql";
import * as sc from "./FolderTable.sc";
import FolderTableDragLayer from "./FolderTableDragLayer";
import { FolderTableRow, isFile, isFolder } from "./FolderTableRow";
import { InnerTableWrapper } from "./InnerTableWrapper";
import { DamMultiselectContext, useDamMultiselect } from "./multiselect/DamMultiselect";
import { TableHead } from "./TableHead";
import { useDamSearchHighlighting } from "./useDamSearchHighlighting";

export const damItemsListLimit = 20;

interface FolderTableProps extends DamConfig {
    id?: string;
    breadcrumbs?: BreadcrumbItem[];
    filterApi: IFilterApi<DamFilter>;
    selectionApi: ISelectionApi;
}

const FolderTable = ({
    id,
    filterApi,
    breadcrumbs,
    selectionApi,
    hideContextMenu,
    hideArchiveFilter,
    renderDamLabel,
    TableContainer: ConfigTableContainer,
    ...props
}: FolderTableProps): React.ReactElement => {
    const client = useApolloClient();
    const intl = useIntl();
    const { allAcceptedMimeTypes } = useDamAcceptedMimeTypes();

    const [isHovered, setIsHovered] = React.useState<boolean>(false);
    const [footerType, setFooterType] = React.useState<FooterType>();
    const [footerFolderName, setFooterFolderName] = React.useState<string>();

    const {
        uploadFiles,
        dialogs: fileUploadDialogs,
        dropzoneConfig,
        newlyUploadedFileIds,
    } = useFileUpload({
        acceptedMimetypes: props.allowedMimetypes ?? allAcceptedMimeTypes,
        onAfterUpload: () => {
            client.reFetchObservableQueries();
        },
    });

    const showFooter = useThrottledCallback((type: FooterType, folderName?: string) => {
        setFooterType(type);
        setFooterFolderName(folderName);
    }, 500);

    const hideFooter = () => {
        if (showFooter.isPending()) {
            showFooter.cancel();
        }
        setFooterType(undefined);
        setFooterFolderName(undefined);
    };

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

    const { data } = useQuery<GQLDamFolderQuery, GQLDamFolderQueryVariables>(damFolderQuery, {
        variables: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: id!,
        },
        skip: id === undefined,
    });

    const pagingApi = useTableQueryPaging<IRelayPagingVariables<GQLDamItemCursor | null>>({});

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
            first: !pagingApi.current?.before ? damItemsListLimit : undefined,
            after: pagingApi.current?.after
                ? {
                      id: pagingApi.current.after.id,
                      type: pagingApi.current.after.type,
                  }
                : undefined,
            last: pagingApi.current?.before ? damItemsListLimit : undefined,
            before: pagingApi.current?.before
                ? {
                      id: pagingApi.current.before.id,
                      type: pagingApi.current.before.type,
                  }
                : undefined,
        },
        resolveTableData: (data) => {
            return {
                data: data.damItemsList.edges?.map((edge) => edge.node),
                totalCount: 0,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                pagingInfo: createRelayPagingActions<GQLPaginatedDamItems, GQLDamItemCursor | null>(pagingApi, data.damItemsList),
            };
        },
    });

    const foldersTableData = tableData?.data?.filter(isFolder);
    const filesTableData = tableData?.data?.filter(isFile);
    const firstLastUploadedFileId = filesTableData?.find((file) => newlyUploadedFileIds.includes(file.id))?.id;

    const { matches } = useDamSearchHighlighting({
        items: [...(foldersTableData || []), ...(filesTableData || [])],
        query: filterApi.current.searchText ?? "",
    });

    const isSearching = !!(filterApi.current.searchText && filterApi.current.searchText.length > 0);

    const TableContainer = ConfigTableContainer ?? MainContent;

    const tableColumns: ITableColumn<GQLDamFileTableFragment | GQLDamFolderTableFragment>[] = [
        {
            name: "name",
            header: intl.formatMessage({
                id: "comet.dam.file.name",
                defaultMessage: "Name",
            }),
            cellProps: { style: { width: "100%" } },
            render: (row) => {
                return renderDamLabel ? (
                    renderDamLabel(row, { matches: matches.get(row.id) })
                ) : (
                    <Link
                        underline="none"
                        component={StackLink}
                        pageName={isFile(row) ? "edit" : "folder"}
                        payload={row.id}
                        onClick={() => {
                            if (isFolder(row)) {
                                filterApi.formApi.change("searchText", undefined);
                            }
                        }}
                    >
                        <DamLabel asset={row} showPath={isSearching} matches={matches.get(row.id)} />
                    </Link>
                );
            },
        },
        {
            name: "size",
            header: intl.formatMessage({
                id: "comet.dam.file.size",
                defaultMessage: "Size",
            }),
            cellProps: { style: { whiteSpace: "nowrap", textAlign: "right" } },
            render: (row) => {
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
        },
        {
            name: "updatedAt",
            header: "",
            cellProps: { style: { whiteSpace: "nowrap" } },
            render: (row) => (
                <div>
                    <FormattedDate value={row.updatedAt} day="2-digit" month="2-digit" year="numeric" />
                    {", "}
                    <FormattedTime value={row.updatedAt} />
                </div>
            ),
        },
    ];

    if (!hideContextMenu) {
        tableColumns.push({
            name: "contextMenu",
            header: "",
            render: (row) => {
                return isFile(row) ? <DamContextMenu file={row} /> : <DamContextMenu folder={row} />;
            },
        });
    }

    // // handles upload of native file (e.g. file from desktop) to current folder:
    // // If the native file is dropped on a file row in the table, it is uploaded
    // // to the current folder
    const { getRootProps: getFileRootProps } = useDropzone({
        ...dropzoneConfig,
        onDragEnter: () => {
            showHoverStyles();
            showFooter("upload", data?.damFolder.name);
        },
        onDragLeave: () => {
            hideHoverStyles();
            hideFooter();
        },
        onDrop: async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            hideHoverStyles();
            hideFooter();
            await uploadFiles({ acceptedFiles, fileRejections }, data?.damFolder.id);
        },
    });

    // hide footer and hover styling when leaving the TableWrapper
    const [{ isOver }, dropTargetRef] = useDrop({
        accept: [NativeTypes.FILE, "folder", "asset"],
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    React.useEffect(() => {
        if (!isOver) {
            hideFooter();
            hideHoverStyles();
        }
        // only execute this when isOver changes, otherwise there are side effects
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOver]);

    const damMultiselectApi = useDamMultiselect({ totalItemCount: tableData?.totalCount ?? 0 });

    const fileRootProps = getFileRootProps({
        onClick: (event) => {
            event.stopPropagation();
        },
    });

    return (
        <DamMultiselectContext.Provider value={damMultiselectApi}>
            <TableContainer>
                {!props.hideDamActions && <DamActions files={filesTableData ?? []} folders={foldersTableData ?? []} />}
                <FolderTableDragLayer />
                <sc.TableWrapper ref={dropTargetRef}>
                    <TableHead isSearching={isSearching} numberItems={tableData?.totalCount ?? 0} breadcrumbs={breadcrumbs} folderId={id} />
                    <sc.TableHoverHighlight $isHovered={isHovered}>
                        <InnerTableWrapper error={error} loading={tableLoading}>
                            <Table<GQLDamFolderTableFragment>
                                hideTableHead
                                totalCount={tableData?.totalCount ?? 0}
                                data={tableLoading || foldersTableData === undefined ? [] : foldersTableData}
                                columns={tableColumns}
                                renderTableRow={({ columns, row, rowProps }) => {
                                    return (
                                        <FolderTableRow
                                            key={row.id}
                                            dropTargetItem={row}
                                            rowProps={rowProps}
                                            footerApi={{ show: showFooter, hide: hideFooter }}
                                            {...props}
                                        >
                                            <TableColumns columns={columns} row={row} />
                                        </FolderTableRow>
                                    );
                                }}
                            />

                            <sc.FilesTableWrapper className="CometFilesTableWrapper-root" {...fileRootProps}>
                                <Table<GQLDamFileTableFragment>
                                    hideTableHead
                                    totalCount={tableData?.totalCount ?? 0}
                                    data={tableLoading || filesTableData === undefined ? [] : filesTableData}
                                    columns={tableColumns}
                                    pagingInfo={tableData?.pagingInfo}
                                    renderTableRow={({ columns, row, rowProps }) => {
                                        return (
                                            <FolderTableRow
                                                key={row.id}
                                                dropTargetItem={row}
                                                rowProps={rowProps}
                                                footerApi={{ show: showFooter, hide: hideFooter }}
                                                archived={row.archived}
                                                isNew={newlyUploadedFileIds.includes(row.id)}
                                                scrollIntoView={firstLastUploadedFileId === row.id}
                                                {...props}
                                            >
                                                <TableColumns columns={columns} row={row} />
                                            </FolderTableRow>
                                        );
                                    }}
                                />
                            </sc.FilesTableWrapper>
                        </InnerTableWrapper>
                    </sc.TableHoverHighlight>
                </sc.TableWrapper>
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
                <DamDnDFooter type={footerType} open={footerType !== undefined} folderName={footerFolderName} />
            </TableContainer>
            {fileUploadDialogs}
        </DamMultiselectContext.Provider>
    );
};

export default FolderTable;
