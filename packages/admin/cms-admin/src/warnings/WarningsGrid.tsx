import { gql, useApolloClient, useQuery } from "@apollo/client";
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
import { ArrowRight, OpenNewTab, WarningSolid } from "@comet/admin-icons";
import { Chip, IconButton } from "@mui/material";
import { DataGrid, type GridFilterModel, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router";

import { useContentScope } from "../contentScope/Provider";
import { useDependenciesConfig } from "../dependencies/DependenciesConfig";
import { type DependencyInterface } from "../dependencies/types";
import { type GQLWarningSeverity } from "../graphql.generated";
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
        sourceInfo {
            rootEntityName
            rootColumnName
            targetId
            jsonPath
        }
        scope
    }
`;

const warningsQuery = gql`
    query WarningsGrid($offset: Int, $limit: Int, $sort: [WarningSort!], $search: String, $filter: WarningFilter, $scopes: [JSONObject!]!) {
        warnings(offset: $offset, limit: $limit, sort: $sort, search: $search, filter: $filter, scopes: $scopes) {
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
    const history = useHistory();
    const entityDependencyMap = useDependenciesConfig();
    const apolloClient = useApolloClient();
    const contentScope = useContentScope();
    const { values: scopeValues, createUrl } = useContentScope();

    const scopes = scopeValues.map((item) => Object.fromEntries(Object.entries(item).map(([key, value]) => [key, value.value])));
    const scopeValueOptions = scopeValues.map((item) => {
        const scopeNameArray = Object.entries(item).map(([key, value]) => {
            return value.label ?? value.value;
        });

        const scope = Object.fromEntries(Object.entries(item).map(([key, value]) => [key, value.value]));
        return {
            value: JSON.stringify(scope),
            label: scopeNameArray.join(" / "),
        };
    });

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
            renderCell: (params) => {
                const colorMapping: Record<GQLWarningSeverity, "error" | "warning" | "default"> = {
                    high: "error",
                    medium: "warning",
                    low: "default",
                };
                return (
                    <Chip
                        icon={params.value === "high" ? <WarningSolid /> : undefined}
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
            field: "scope",
            headerName: intl.formatMessage({ id: "warning.scope", defaultMessage: "Scope" }),
            type: "singleSelect",
            sortable: false,
            valueOptions: scopeValueOptions,
            valueFormatter: (value) => {
                if (typeof value === "object" && value !== null) {
                    const objectValues = Object.values(value);

                    // Format the values: first value stays as is, values after get " / " added
                    const formattedValues = objectValues.map((val, index) => (index === 0 ? val : ` / ${val}`));
                    return formattedValues.join("");
                }

                return value;
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
        {
            field: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            renderCell: ({ row }) => {
                const dependencyObject = entityDependencyMap[row.sourceInfo.rootEntityName] as DependencyInterface | undefined;

                if (!dependencyObject) return null; // to some warnings it cannot be linked to. When missing a dependency or for example a failing job cannot be resolved in the admin and therefore cannot have a link

                if (dependencyObject === undefined) {
                    if (process.env.NODE_ENV === "development") {
                        console.warn(
                            `Cannot load URL because no implementation of DependencyInterface for ${row.sourceInfo.rootEntityName} was provided via the DependenciesConfig`,
                        );
                    }
                    return <FormattedMessage id="comet.dependencies.dataGrid.cannotLoadUrl" defaultMessage="Cannot determine URL" />;
                }

                const loadUrl = async () => {
                    const path = await dependencyObject.resolvePath({
                        rootColumnName: row.sourceInfo.rootColumnName ?? undefined,
                        jsonPath: row.sourceInfo.jsonPath ?? undefined,
                        apolloClient,
                        id: row.sourceInfo.targetId,
                    });
                    const scopeUrl = row.scope ? createUrl(row.scope) : contentScope.match;
                    return scopeUrl + path;
                };

                return (
                    <div style={{ display: "flex" }}>
                        <IconButton
                            onClick={async () => {
                                const url = await loadUrl();
                                window.open(url, "_blank");
                            }}
                        >
                            <OpenNewTab />
                        </IconButton>
                        <IconButton
                            onClick={async () => {
                                const url = await loadUrl();

                                history.push(url);
                            }}
                        >
                            <ArrowRight />
                        </IconButton>
                    </div>
                );
            },
        },
    ];

    function gridFilterToGql(columns: GridColDef[], filterModel?: GridFilterModel) {
        // Create a custom filter model by transforming the filterModel's items
        const customFilterModel = {
            ...filterModel,
            items:
                filterModel?.items.map((item) => {
                    if (item.field === "scope") {
                        if (typeof item.value === "string") {
                            return { ...item, value: JSON.parse(item.value) };
                        }

                        if (typeof item.value === "object" && Array.isArray(item.value)) {
                            return { ...item, value: item.value.map((value) => JSON.parse(value)) };
                        }
                    }

                    return item;
                }) ?? [],
        };

        return muiGridFilterToGql(columns, customFilterModel);
    }

    const { filter: gqlFilter, search: gqlSearch } = gridFilterToGql(columns, dataGridProps.filterModel);

    const { data, loading, error } = useQuery<GQLWarningsGridQuery, GQLWarningsGridQueryVariables>(warningsQuery, {
        variables: {
            scopes,
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
