import { useQuery } from "@apollo/client";
import {
    dataGridDateTimeColumn,
    DataGridToolbar,
    GridCellContent,
    type GridColDef,
    GridFilterButton,
    MainContent,
    messages,
    muiGridFilterToGql,
    muiGridSortToGql,
    ToolbarItem,
    Tooltip,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Time, View } from "@comet/admin-icons";
import { Autocomplete, Box, Chip, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, type GridFilterInputValueProps, type GridFilterItem, type GridFilterOperator, useGridRootProps } from "@mui/x-data-grid";
import { capitalCase } from "change-case";
import isEqual from "lodash.isequal";
import { createContext, useContext, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { type ContentScope, useContentScope } from "../../../contentScope/Provider";
import { UserCell } from "../../actionLogGrid/userCell/UserCell";
import { ActionChip } from "../actionChip/ActionChip";
import { ActionLogsDialog } from "../actionLogsDialog/ActionLogsDialog";
import { ActionLogsShowVersionDialog } from "../actionLogsShowVersionDialog/ActionLogsShowVersionDialog";
import { actionLogsGridQuery } from "./ActionLogsGrid.gql";
import type { GQLActionLogsGridFragment, GQLActionLogsGridQuery, GQLActionLogsGridQueryVariables } from "./ActionLogsGrid.gql.generated";

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

const EntityTypeChip = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
}));

const GLOBAL_SCOPE_VALUE = "__global__";

function scopeColumnToGqlFilter(filterItem: GridFilterItem) {
    if (filterItem.operator === "isAnyOf") {
        const values = (filterItem.value as string[] | undefined) ?? [];
        const hasGlobal = values.includes(GLOBAL_SCOPE_VALUE);
        const scopes = values.filter((value) => value !== GLOBAL_SCOPE_VALUE).map((value) => JSON.parse(value));
        if (hasGlobal && scopes.length > 0) {
            return { or: [{ scope: { isGlobal: true } }, { scope: { isAnyOf: scopes } }] };
        }
        if (hasGlobal) {
            return { scope: { isGlobal: true } };
        }
        return { scope: { isAnyOf: scopes } };
    }
    if (filterItem.value === GLOBAL_SCOPE_VALUE) {
        return { scope: { isGlobal: filterItem.operator !== "not" } };
    }
    const gqlOperator = filterItem.operator === "not" ? "notEqual" : "equal";
    const value = typeof filterItem.value === "string" ? JSON.parse(filterItem.value) : filterItem.value;
    return { scope: { [gqlOperator]: value } };
}

type ScopeOption = { value: string; label: string };

const ScopeFilterOptionsContext = createContext<ScopeOption[]>([]);

function ScopeFilterSingleInput({ item, applyValue, focusElementRef, apiRef }: GridFilterInputValueProps) {
    const options = useContext(ScopeFilterOptionsContext);
    const rootProps = useGridRootProps();
    const selectedValue = typeof item.value === "string" ? (options.find((option) => option.value === item.value) ?? null) : null;
    return (
        <Autocomplete<ScopeOption, false, false, false>
            options={options}
            value={selectedValue}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, candidate) => option.value === candidate.value}
            onChange={(_, newValue) => applyValue({ ...item, value: newValue?.value ?? null })}
            renderInput={(params) => (
                <rootProps.slots.baseTextField
                    {...params}
                    label={apiRef.current.getLocaleText("filterPanelInputLabel")}
                    inputRef={focusElementRef}
                    slotProps={{
                        inputLabel: { shrink: true },
                        input: params.InputProps,
                    }}
                />
            )}
        />
    );
}

function ScopeFilterMultiInput({ item, applyValue, focusElementRef, apiRef }: GridFilterInputValueProps) {
    const options = useContext(ScopeFilterOptionsContext);
    const rootProps = useGridRootProps();
    const selectedValues = Array.isArray(item.value) ? (item.value as string[]) : [];
    const selectedOptions = options.filter((option) => selectedValues.includes(option.value));
    return (
        <Autocomplete<ScopeOption, true, false, false>
            multiple
            options={options}
            value={selectedOptions}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, candidate) => option.value === candidate.value}
            onChange={(_, newValue) => applyValue({ ...item, value: newValue.map((option) => option.value) })}
            renderInput={(params) => (
                <rootProps.slots.baseTextField
                    {...params}
                    label={apiRef.current.getLocaleText("filterPanelInputLabel")}
                    inputRef={focusElementRef}
                    slotProps={{
                        inputLabel: { shrink: true },
                        input: params.InputProps,
                    }}
                />
            )}
        />
    );
}

const throwOnLocalScopeFilter = () => {
    throw new Error("Server-side filter; not applied on the client.");
};

const scopeFilterOperators: GridFilterOperator[] = [
    { value: "is", getApplyFilterFn: throwOnLocalScopeFilter, InputComponent: ScopeFilterSingleInput },
    { value: "not", getApplyFilterFn: throwOnLocalScopeFilter, InputComponent: ScopeFilterSingleInput },
    { value: "isAnyOf", getApplyFilterFn: throwOnLocalScopeFilter, InputComponent: ScopeFilterMultiInput },
];

function ActionLogsGridToolbar() {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
        </DataGridToolbar>
    );
}

export function ActionLogsGrid() {
    const intl = useIntl();
    const { values: scopeValues } = useContentScope();
    const [openVersionId, setOpenVersionId] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState<{ entityName: string; entityId: string } | null>(null);

    const dataGridProps = {
        ...useDataGridRemote({ initialSort: [{ field: "createdAt", sort: "desc" }] }),
        ...usePersistentColumnState("ActionLogsGrid"),
    };

    const formatScopeLabel = useMemo(
        () =>
            (scope: ContentScope): string => {
                const matched = scopeValues.find((item) => isEqual(item.scope, scope));
                const source = matched ?? { scope, label: undefined as Record<string, string> | undefined };
                return Object.keys(source.scope)
                    .map((key) => source.label?.[key] ?? capitalCase(String(source.scope[key])))
                    .join(" / ");
            },
        [scopeValues],
    );

    const scopeValueOptions = useMemo(
        () => [
            { value: GLOBAL_SCOPE_VALUE, label: intl.formatMessage(messages.globalContentScope) },
            ...scopeValues.map((item) => ({
                value: JSON.stringify(item.scope),
                label: formatScopeLabel(item.scope),
            })),
        ],
        [intl, scopeValues, formatScopeLabel],
    );

    const columns = useMemo<GridColDef<GQLActionLogsGridFragment>[]>(
        () => [
            {
                ...dataGridDateTimeColumn,
                field: "createdAt",
                headerName: intl.formatMessage({ id: "comet.actionLogs.columns.createdAt", defaultMessage: "Date / Time" }),
                width: 200,
            },
            {
                field: "scope",
                headerName: intl.formatMessage({ id: "comet.actionLogs.columns.scope", defaultMessage: "Scope" }),
                filterOperators: scopeFilterOperators,
                toGqlFilter: scopeColumnToGqlFilter,
                width: 150,
                renderCell: ({ row }) => {
                    const scopes = (row.scope as ContentScope[] | null | undefined) ?? [];
                    if (scopes.length === 0) {
                        return <Chip label={intl.formatMessage(messages.globalContentScope)} />;
                    }
                    return (
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {scopes.map((scope) => (
                                <Chip key={JSON.stringify(scope)} label={formatScopeLabel(scope)} />
                            ))}
                        </Box>
                    );
                },
            },
            {
                field: "action",
                headerName: intl.formatMessage({ id: "comet.actionLogs.columns.action", defaultMessage: "Action" }),
                type: "singleSelect",
                sortable: false,
                width: 150,
                valueOptions: [
                    { value: "Created", label: intl.formatMessage({ id: "comet.actionLogs.action.created", defaultMessage: "Created" }) },
                    { value: "Updated", label: intl.formatMessage({ id: "comet.actionLogs.action.updated", defaultMessage: "Updated" }) },
                    { value: "Deleted", label: intl.formatMessage({ id: "comet.actionLogs.action.deleted", defaultMessage: "Deleted" }) },
                ],
                renderCell: ({ value }) => <ActionChip actionValue={value} label={value} />,
            },
            {
                field: "entityName",
                headerName: intl.formatMessage({ id: "comet.actionLogs.columns.entityName", defaultMessage: "Entity type" }),
                width: 150,
                renderCell: ({ value }) => <EntityTypeChip label={value} />,
            },
            {
                field: "entityId",
                headerName: intl.formatMessage({ id: "comet.actionLogs.columns.entity", defaultMessage: "Entity" }),
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
                field: "user",
                headerName: intl.formatMessage({ id: "comet.actionLogs.columns.user", defaultMessage: "User" }),
                minWidth: 200,
                flex: 1,
                sortable: false,
                filterable: false,
                renderCell: ({ row }) => <UserCell id={row.user.id} name={row.user.name ?? undefined} />,
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
                        <Tooltip title={<FormattedMessage id="comet.actionLogs.actions.showVersion" defaultMessage="Show version" />}>
                            <IconButton color="primary" onClick={() => setOpenVersionId(row.id)}>
                                <View />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title={
                                <FormattedMessage
                                    id="comet.actionLogs.actions.showEntityActionLog"
                                    defaultMessage="Show action log for this entity"
                                />
                            }
                        >
                            <IconButton onClick={() => setOpenDialog({ entityName: row.entityName, entityId: row.entityId })}>
                                <Time />
                            </IconButton>
                        </Tooltip>
                    </>
                ),
            },
        ],
        [intl, formatScopeLabel],
    );

    const { filter: gqlFilter } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const scopes = useMemo(() => scopeValues.map((item) => item.scope), [scopeValues]);

    const { data, loading, error } = useQuery<GQLActionLogsGridQuery, GQLActionLogsGridQueryVariables>(actionLogsGridQuery, {
        variables: {
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            filter: gqlFilter,
            scopes,
            sort: muiGridSortToGql(dataGridProps.sortModel),
        },
    });

    const rowCount = useBufferedRowCount(data?.actionLogs.totalCount);

    if (error) {
        throw error;
    }

    return (
        <ScopeFilterOptionsContext.Provider value={scopeValueOptions}>
            <MainContent fullHeight>
                <DataGrid
                    {...dataGridProps}
                    columns={columns}
                    rows={data?.actionLogs.nodes ?? []}
                    rowCount={rowCount}
                    loading={loading}
                    disableRowSelectionOnClick
                    onRowClick={({ row }) => setOpenVersionId(row.id)}
                    slots={{ toolbar: ActionLogsGridToolbar }}
                    showToolbar
                />
                <ActionLogsShowVersionDialog actionLogId={openVersionId} open={openVersionId !== null} onClose={() => setOpenVersionId(null)} />
                {openDialog && (
                    <ActionLogsDialog entityName={openDialog.entityName} entityId={openDialog.entityId} open onClose={() => setOpenDialog(null)} />
                )}
            </MainContent>
        </ScopeFilterOptionsContext.Provider>
    );
}

export { actionLogsGridFragment } from "./ActionLogsGrid.gql";
