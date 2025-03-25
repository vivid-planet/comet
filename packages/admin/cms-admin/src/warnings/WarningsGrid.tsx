import { gql, useQuery } from "@apollo/client";
import {
    dataGridDateTimeColumn,
    DataGridToolbar,
    type GridColDef,
    GridFilterButton,
    MainContent,
    muiGridFilterToGql,
    muiGridSortToGql,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Chip } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { WarningActions } from "./WarningActions";
import { WarningMessage } from "./WarningMessage";
import { warningMessages as cometWarningMessages } from "./warningMessages";
import { WarningSeverity } from "./WarningSeverity";
import { type GQLWarningsGridQuery, type GQLWarningsGridQueryVariables, type GQLWarningsListFragment } from "./WarningsGrid.generated";

const warningsFragment = gql`
    fragment WarningsList on Warning {
        id
        createdAt
        updatedAt
        message
        type
        severity
        status
        sourceInfo {
            rootEntityName
            rootColumnName
            targetId
            jsonPath
        }
    }
`;

const warningsQuery = gql`
    query WarningsGrid($offset: Int, $limit: Int, $sort: [WarningSort!], $search: String, $filter: WarningFilter) {
        warnings(offset: $offset, limit: $limit, sort: $sort, search: $search, filter: $filter) {
            nodes {
                ...WarningsList
            }
            totalCount
        }
    }
    ${warningsFragment}
`;

function WarningsGridToolbar() {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
        </DataGridToolbar>
    );
}

interface WarningsGridProps {
    warningMessages?: Record<string, ReactNode>;
}

export function WarningsGrid({ warningMessages: projectWarningMessages }: WarningsGridProps) {
    const intl = useIntl();
    const dataGridProps = {
        ...useDataGridRemote({ initialFilter: { items: [{ field: "state", operator: "is", value: "open" }] } }),
        ...usePersistentColumnState("WarningsGrid"),
    };
    const warningMessages = { ...cometWarningMessages, ...projectWarningMessages };

    const columns: GridColDef<GQLWarningsListFragment>[] = [
        {
            ...dataGridDateTimeColumn,
            field: "createdAt",
            headerName: intl.formatMessage({ id: "warning.dateTime", defaultMessage: "Date / Time" }),
            width: 200,
        },
        {
            field: "severity",
            headerName: intl.formatMessage({ id: "warning.severity", defaultMessage: "Severity" }),
            type: "singleSelect",
            valueOptions: [
                { value: "high", label: intl.formatMessage({ id: "warning.severity.high", defaultMessage: "High" }) },
                { value: "medium", label: intl.formatMessage({ id: "warning.severity.medium", defaultMessage: "Medium" }) },
                { value: "low", label: intl.formatMessage({ id: "warning.severity.low", defaultMessage: "Low" }) },
            ],
            width: 150,
            renderCell: (params) => <WarningSeverity severity={params.value} />,
        },
        {
            field: "type",
            headerName: intl.formatMessage({ id: "warning.type", defaultMessage: "Type" }),
            width: 150,
            renderCell: (params) => <Chip label={params.value} />,
        },
        {
            field: "message",
            headerName: intl.formatMessage({ id: "warning.message", defaultMessage: "Message" }),
            flex: 1,
            renderCell: (params) => <WarningMessage message={params.value} warningMessages={warningMessages} />,
        },
        {
            field: "status",
            headerName: intl.formatMessage({ id: "warning.status", defaultMessage: "Status" }),
            type: "singleSelect",
            valueOptions: [
                { value: "open", label: intl.formatMessage({ id: "warning.status.open", defaultMessage: "Open" }) },
                { value: "resolved", label: intl.formatMessage({ id: "warning.status.resolved", defaultMessage: "Resolved" }) },
                { value: "ignored", label: intl.formatMessage({ id: "warning.status.ignored", defaultMessage: "Ignored" }) },
            ],
            width: 150,
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            renderCell: ({ row }) => <WarningActions sourceInfo={row.sourceInfo} />,
        },
    ];

    const { filter: gqlFilter, search: gqlSearch } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const { data, loading, error } = useQuery<GQLWarningsGridQuery, GQLWarningsGridQueryVariables>(warningsQuery, {
        variables: {
            filter: gqlFilter,
            search: gqlSearch,
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            sort: muiGridSortToGql(dataGridProps.sortModel),
        },
    });
    const rowCount = useBufferedRowCount(data?.warnings.totalCount);
    if (error) throw error;
    const rows = data?.warnings.nodes ?? [];

    return (
        <MainContent fullHeight>
            <DataGrid
                {...dataGridProps}
                disableRowSelectionOnClick
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                slots={{
                    toolbar: WarningsGridToolbar,
                }}
            />
        </MainContent>
    );
}
