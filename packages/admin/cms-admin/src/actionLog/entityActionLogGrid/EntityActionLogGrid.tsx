import { gql, useQuery } from "@apollo/client";
import {
    dataGridDateTimeColumn,
    DataGridToolbar,
    GridCellContent,
    type GridColDef,
    GridFilterButton,
    MainContent,
    muiGridFilterToGql,
    muiGridSortToGql,
    ToolbarItem,
    Tooltip,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Time, View } from "@comet/admin-icons";
import { Chip, type ChipProps, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid } from "@mui/x-data-grid";
import type { DocumentNode } from "graphql";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type ContentScope, useContentScope } from "../../contentScope/Provider";
import { UserCell } from "../actionLogGrid/userCell/UserCell";
import { EntityActionLogEntryDialog } from "./EntityActionLogEntryDialog";
import { entityActionLogGridFragment } from "./EntityActionLogGrid.gql";
import type { GQLEntityActionLogGridFragment } from "./EntityActionLogGrid.gql.generated";
import { EntityActionLogShowVersionDialog } from "./EntityActionLogShowVersionDialog";

type EntityActionLogGridProps = {
    /**
     * Top-level entity-scoped action log query (e.g. `newsActionLogs`).
     * Caller passes it in because the GraphQL field name is entity-specific.
     */
    actionLogsQuery: DocumentNode;
    /**
     * Key under which the result is exposed on the query (e.g. `newsActionLogs`).
     * Used to read `{ nodes, totalCount }` from the response.
     */
    queryResultKey: string;
    /**
     * Used to namespace persisted column state per entity grid.
     */
    persistentColumnStateKey: string;
};

type ActionChipProps = ChipProps & { actionValue: string };

const ActionChip = styled(({ actionValue, ...rest }: ActionChipProps) => <Chip {...rest} />, {
    shouldForwardProp: (prop) => prop !== "actionValue",
})(({ theme, actionValue }) => {
    if (actionValue === "Created") {
        return { backgroundColor: theme.palette.success.main, color: theme.palette.success.contrastText };
    }
    if (actionValue === "Updated") {
        return { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText };
    }
    if (actionValue === "Deleted") {
        return { backgroundColor: theme.palette.error.main, color: theme.palette.error.contrastText };
    }
    return {};
});

const displayNameFields = ["name", "title", "label", "slug", "description"] as const;

function extractDisplayName(snapshot: Record<string, unknown> | null | undefined): string | undefined {
    if (!snapshot) {
        return undefined;
    }
    for (const field of displayNameFields) {
        const value = snapshot[field];
        if (typeof value === "string" && value.length > 0) {
            return value;
        }
    }
    return undefined;
}

function EntityActionLogGridToolbar() {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
        </DataGridToolbar>
    );
}

type SelectedRow = GQLEntityActionLogGridFragment;

type EntityActionLogsQueryResult = {
    [key: string]: { nodes: GQLEntityActionLogGridFragment[]; totalCount: number };
};

export function EntityActionLogGrid({ actionLogsQuery, queryResultKey, persistentColumnStateKey }: EntityActionLogGridProps) {
    const intl = useIntl();
    const { scope } = useContentScope();
    const [selectedRow, setSelectedRow] = useState<SelectedRow | null>(null);
    const [openEntityId, setOpenEntityId] = useState<string | null>(null);

    const dataGridProps = {
        ...useDataGridRemote({ initialSort: [{ field: "createdAt", sort: "desc" }] }),
        ...usePersistentColumnState(persistentColumnStateKey),
    };

    const columns = useMemo<GridColDef<GQLEntityActionLogGridFragment>[]>(
        () => [
            {
                ...dataGridDateTimeColumn,
                field: "createdAt",
                headerName: intl.formatMessage({ id: "comet.actionLog.entity.columns.createdAt", defaultMessage: "Date / Time" }),
                width: 200,
            },
            {
                field: "action",
                headerName: intl.formatMessage({ id: "comet.actionLog.entity.columns.action", defaultMessage: "Action" }),
                type: "singleSelect",
                sortable: false,
                width: 150,
                valueOptions: [
                    { value: "Created", label: intl.formatMessage({ id: "comet.actionLog.entity.action.created", defaultMessage: "Created" }) },
                    { value: "Updated", label: intl.formatMessage({ id: "comet.actionLog.entity.action.updated", defaultMessage: "Updated" }) },
                    { value: "Deleted", label: intl.formatMessage({ id: "comet.actionLog.entity.action.deleted", defaultMessage: "Deleted" }) },
                ],
                renderCell: ({ value }) => <ActionChip actionValue={value} label={value} />,
            },
            {
                field: "entityId",
                headerName: intl.formatMessage({ id: "comet.actionLog.entity.columns.entity", defaultMessage: "Entity" }),
                minWidth: 280,
                flex: 1,
                sortable: false,
                filterable: false,
                renderCell: ({ row }) => {
                    const displayName =
                        extractDisplayName(row.snapshot as Record<string, unknown> | null | undefined) ??
                        extractDisplayName(row.previousVersion?.snapshot as Record<string, unknown> | null | undefined);
                    return <GridCellContent primaryText={displayName ?? row.entityId} secondaryText={displayName ? row.entityId : undefined} />;
                },
            },
            {
                field: "userId",
                headerName: intl.formatMessage({ id: "comet.actionLog.entity.columns.user", defaultMessage: "User" }),
                minWidth: 200,
                flex: 1,
                renderCell: ({ row }) => <UserCell name={row.userId} />,
            },
            {
                field: "actions",
                type: "actions",
                headerName: "",
                width: 100,
                sortable: false,
                filterable: false,
                renderCell: ({ row }) => (
                    <>
                        <Tooltip title={<FormattedMessage id="comet.actionLog.entity.actions.showVersion" defaultMessage="Show version" />}>
                            <IconButton color="primary" onClick={() => setSelectedRow(row)}>
                                <View />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title={
                                <FormattedMessage
                                    id="comet.actionLog.entity.actions.showEntityActionLog"
                                    defaultMessage="Show action log for this entity"
                                />
                            }
                        >
                            <IconButton onClick={() => setOpenEntityId(row.entityId)}>
                                <Time />
                            </IconButton>
                        </Tooltip>
                    </>
                ),
            },
        ],
        [intl],
    );

    const { filter: gqlFilter } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const { data, loading, error } = useQuery<EntityActionLogsQueryResult>(actionLogsQuery, {
        variables: {
            scope: scope as ContentScope,
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            filter: gqlFilter,
            sort: muiGridSortToGql(dataGridProps.sortModel),
        },
    });

    const result = data?.[queryResultKey];
    const rowCount = useBufferedRowCount(result?.totalCount);

    if (error) {
        throw error;
    }

    return (
        <MainContent fullHeight>
            <DataGrid
                {...dataGridProps}
                columns={columns}
                rows={result?.nodes ?? []}
                rowCount={rowCount}
                loading={loading}
                disableRowSelectionOnClick
                onRowClick={({ row }) => setSelectedRow(row)}
                slots={{ toolbar: EntityActionLogGridToolbar }}
                showToolbar
            />
            <EntityActionLogShowVersionDialog actionLog={selectedRow} open={selectedRow !== null} onClose={() => setSelectedRow(null)} />
            {openEntityId !== null && (
                <EntityActionLogEntryDialog
                    actionLogsQuery={actionLogsQuery}
                    queryResultKey={queryResultKey}
                    entityId={openEntityId}
                    open
                    onClose={() => setOpenEntityId(null)}
                />
            )}
        </MainContent>
    );
}

export function createEntityActionLogsQuery(queryName: string): DocumentNode {
    return gql`
        query ${queryName[0].toUpperCase() + queryName.slice(1)}($scope: JSONObject!, $offset: Int!, $limit: Int!, $filter: ActionLogFilter, $sort: [ActionLogSort!]) {
            ${queryName}(scope: $scope, offset: $offset, limit: $limit, filter: $filter, sort: $sort) {
                nodes {
                    ...EntityActionLogGrid
                }
                totalCount
            }
        }
        ${entityActionLogGridFragment}
    `;
}

export { entityActionLogGridFragment } from "./EntityActionLogGrid.gql";
