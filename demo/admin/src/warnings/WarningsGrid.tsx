import { gql, useQuery } from "@apollo/client";
import {
    DataGridToolbar,
    GridColDef,
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
import { GQLWarningSeverity } from "@src/graphql.generated";
import * as React from "react";
import { FormattedDate, FormattedTime, useIntl } from "react-intl";

import { GQLWarningsGridQuery, GQLWarningsGridQueryVariables, GQLWarningsListFragment } from "./WarningsGrid.generated";

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

interface Props {
    warningMessages: Record<string, React.ReactNode>;
}

export function WarningsGrid({ warningMessages }: Props): React.ReactElement {
    const intl = useIntl();
    const dataGridProps = {
        ...useDataGridRemote({ initialFilter: { items: [{ columnField: "state", operatorValue: "is", value: "open" }] } }),
        ...usePersistentColumnState("WarningsGrid"),
    };

    const columns: GridColDef<GQLWarningsListFragment>[] = [
        {
            field: "createdAt",
            headerName: intl.formatMessage({ id: "warning.dateTime", defaultMessage: "Date / Time" }),
            type: "dateTime",
            renderCell: (params) => (
                <>
                    <FormattedDate value={params.value} /> <FormattedTime value={params.value} />
                </>
            ),
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
            renderCell: (params) => (params.value in warningMessages ? warningMessages[params.value as keyof typeof warningMessages] : params.value),
            flex: 1,
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
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
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
                disableSelectionOnClick
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                components={{
                    Toolbar: WarningsGridToolbar,
                }}
            />
        </MainContent>
    );
}
