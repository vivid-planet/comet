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
import { WarningSolid } from "@comet/admin-icons";
import { Chip } from "@mui/material";
import { DataGrid, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { type GQLWarningSeverity } from "@src/graphql.generated";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { warningMessages as cometWarningMessages } from "./warningMessages";
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
                { value: "critical", label: intl.formatMessage({ id: "warning.severity.critical", defaultMessage: "Critical" }) },
                { value: "high", label: intl.formatMessage({ id: "warning.severity.high", defaultMessage: "High" }) },
                { value: "low", label: intl.formatMessage({ id: "warning.severity.low", defaultMessage: "Low" }) },
            ],
            width: 150,
            renderCell: (params) => {
                const colorMapping: Record<GQLWarningSeverity, "error" | "warning" | "default"> = {
                    critical: "error",
                    high: "warning",
                    low: "default",
                };
                return (
                    <Chip
                        icon={params.value === "critical" ? <WarningSolid /> : undefined}
                        color={colorMapping[params.value as GQLWarningSeverity]}
                        label={params.value}
                    />
                );
            },
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
            renderCell: (params) => {
                const warning = warningMessages[params.value as keyof typeof warningMessages];

                if (warning) {
                    return warning;
                } else {
                    console.error(`Missing warning message for "${params.value}". Custom warning messages can be passed to WarningsPage component.`);
                    return params.value;
                }
            },
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
