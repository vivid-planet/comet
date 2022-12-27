import {
    BreadcrumbItem,
    createOffsetLimitPagingAction,
    IFilterApi,
    ISelectionApi,
    PrettyBytes,
    StackLink,
    useTableQuery,
    useTableQueryPaging,
} from "@comet/admin";
import { Link } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedDate, FormattedMessage, FormattedTime, useIntl } from "react-intl";

import { GQLDamItemsListQuery, GQLDamItemsListQueryVariables } from "../../graphql.generated";
import { DamConfig, DamFilter } from "../DamTable";
import DamContextMenu from "./DamContextMenu";
import DamLabel from "./DamLabel";
import { damItemsListQuery } from "./FolderTable.gql";
import { isFile, isFolder } from "./FolderTableRow";
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

    const [pageSize, setPageSize] = React.useState(20);

    const pagingApi = useTableQueryPaging(0);

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
                pagingInfo: createOffsetLimitPagingAction(pagingApi, data.damItemsList, pageSize),
            };
        },
    });

    const { matches } = useDamSearchHighlighting({
        items: tableData?.data ?? [],
        query: filterApi.current.searchText ?? "",
    });
    const isSearching = !!(filterApi.current.searchText && filterApi.current.searchText.length > 0);

    return (
        <div style={{ padding: "20px" }}>
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
        </div>
    );
};

export default FolderDataGrid;
