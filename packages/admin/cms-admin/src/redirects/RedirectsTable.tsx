import { useQuery } from "@apollo/client";
import {
    Field,
    FinalFormSearchTextField,
    FinalFormSelect,
    LocalErrorScopeApolloContext,
    MainContent,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackSwitchApiContext,
    TableDeleteButton,
    TableFilterFinalForm,
    Toolbar,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
    useTableQueryFilter,
} from "@comet/admin";
import { Add as AddIcon, Delete as DeleteIcon, Edit } from "@comet/admin-icons";
import { BlockInterface, BlockPreview } from "@comet/blocks-admin";
import { Button, IconButton, MenuItem, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GQLPaginatedRedirectsQuery, GQLPaginatedRedirectsQueryVariables, GQLRedirectGenerationType, namedOperations } from "../graphql.generated";
import RedirectActiveness from "./RedirectActiveness";
import { deleteRedirectMutation, paginatedRedirectsQuery } from "./RedirectsTable.gql";

interface Filter extends Omit<GQLPaginatedRedirectsQueryVariables, "active" | "type" | "scope"> {
    type?: "all" | GQLRedirectGenerationType;
    active?: "all" | "activated" | "deactivated";
}

interface Props {
    linkBlock: BlockInterface;
    scope: Record<string, unknown>;
}

export function RedirectsTable({ linkBlock, scope }: Props): JSX.Element {
    const intl = useIntl();

    const typeOptions = [
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.generationType.all",
                defaultMessage: "All",
            }),
            value: "all",
        },
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.generationType.manual",
                defaultMessage: "Manual",
            }),
            value: "manual",
        },
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.generationType.automatic",
                defaultMessage: "Automatic",
            }),
            value: "automatic",
        },
    ];

    const activeOptions = [
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.active.all",
                defaultMessage: "All",
            }),
            value: "all",
        },
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.active.activated",
                defaultMessage: "activated",
            }),
            value: "activated",
        },
        {
            label: intl.formatMessage({
                id: "comet.redirects.redirect.active.deactivated",
                defaultMessage: "deactivated",
            }),
            value: "deactivated",
        },
    ];

    const filterApi = useTableQueryFilter<Filter>({ type: "manual", active: "all" });
    const stackApi = React.useContext(StackSwitchApiContext);

    const columns: GridColDef[] = [
        {
            field: "source",
            headerName: intl.formatMessage({ id: "comet.pages.redirects.redirect.source", defaultMessage: "Source" }),
            sortable: false,
            flex: 1,
        },
        {
            field: "target",
            headerName: intl.formatMessage({ id: "comet.pages.redirects.redirect.target", defaultMessage: "Target" }),
            renderCell: (params) => {
                const state = linkBlock.input2State(params.value);

                return (
                    <TargetWrapper>
                        <BlockPreview
                            title={linkBlock.dynamicDisplayName?.(state) ?? linkBlock.displayName}
                            content={linkBlock.previewContent(state)}
                        />
                    </TargetWrapper>
                );
            },
            sortable: false,
            flex: 1,
        },
        {
            field: "comment",
            headerName: intl.formatMessage({ id: "comet.pages.redirects.redirect.comment", defaultMessage: "Comment" }),
            renderCell: (params) => <div>{params.value}</div>,
            sortable: false,
            flex: 1,
        },
        {
            field: "generationType",
            headerName: intl.formatMessage({
                id: "comet.pages.redirects.redirect.generationType",
                defaultMessage: "GenerationType",
            }),
            renderCell: (params) => (
                <Typography>
                    {params.value === "manual" ? (
                        <FormattedMessage id="comet.redirects.redirect.generationType.manual" defaultMessage="Manual" />
                    ) : (
                        <FormattedMessage id="comet.redirects.redirect.generationType.automatic" defaultMessage="Automatic" />
                    )}
                </Typography>
            ),
            sortable: false,
            flex: 1,
        },
        {
            field: "activeness",
            headerName: intl.formatMessage({
                id: "comet.pages.redirects.redirect.activation",
                defaultMessage: "Activation",
            }),
            renderCell: (params) => <RedirectActiveness redirect={params.row} />,
            sortable: false,
            flex: 1,
        },
        {
            field: "actions",
            headerName: "",
            renderCell: (params) => (
                <IconWrapper>
                    <IconButton
                        onClick={() => {
                            stackApi.activatePage("edit", params.id.toString());
                        }}
                    >
                        <Edit color="primary" />
                    </IconButton>
                    <TableDeleteButton
                        icon={<DeleteIcon />}
                        mutation={deleteRedirectMutation}
                        refetchQueries={[namedOperations.Query.PaginatedRedirects]}
                        selectedId={params.id.toString()}
                        text=""
                    />
                </IconWrapper>
            ),
            sortable: false,
            flex: 1,
            disableColumnMenu: true,
        },
    ];

    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("RedirectsGrid") };
    const sortModel = dataGridProps.sortModel;

    const { data, loading, error } = useQuery<GQLPaginatedRedirectsQuery, GQLPaginatedRedirectsQueryVariables>(paginatedRedirectsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            scope,
            type: filterApi.current.type !== "all" ? filterApi.current.type : undefined,
            active: filterApi.current.active !== "all" ? filterApi.current.active === "activated" : undefined,
            query: filterApi.current.query ?? undefined,
            limit: dataGridProps.pageSize,
            offset: dataGridProps.page * dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel),
        },
        context: LocalErrorScopeApolloContext,
        fetchPolicy: "cache-and-network",
    });

    const rows = data?.paginatedRedirects.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.paginatedRedirects.totalCount);

    return (
        <TableFilterFinalForm filterApi={filterApi}>
            <Toolbar>
                <ToolbarItem>
                    <Field
                        name="query"
                        component={FinalFormSearchTextField}
                        label={intl.formatMessage({
                            id: "comet.redirects.redirect.search",
                            defaultMessage: "Search",
                        })}
                        fullWidth
                    />
                </ToolbarItem>
                <ToolbarItem>
                    <Field
                        name="type"
                        label={intl.formatMessage({
                            id: "comet.redirects.redirect.generationType.type",
                            defaultMessage: "Redirect Type",
                        })}
                        fullWidth
                    >
                        {(props) => (
                            <FinalFormSelect {...props} fullWidth>
                                {typeOptions.map((option) => (
                                    <MenuItem value={option.value} key={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </FinalFormSelect>
                        )}
                    </Field>
                </ToolbarItem>
                <ToolbarItem>
                    <Field
                        name="active"
                        label={intl.formatMessage({
                            id: "comet.redirects.redirect.activation.title",
                            defaultMessage: "Activation",
                        })}
                        fullWidth
                    >
                        {(props) => (
                            <FinalFormSelect {...props} fullWidth>
                                {activeOptions.map((option) => (
                                    <MenuItem value={option.value} key={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </FinalFormSelect>
                        )}
                    </Field>
                </ToolbarItem>
                <ToolbarFillSpace />
                <ToolbarActions>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            stackApi.activatePage("add", "new");
                        }}
                    >
                        <FormattedMessage id="comet.pages.redirects.add" defaultMessage="Add" />
                    </Button>
                </ToolbarActions>
            </Toolbar>
            <MainContent>
                <DataGridContainer>
                    <DataGrid
                        {...dataGridProps}
                        rows={rows}
                        rowCount={rowCount}
                        columns={columns}
                        loading={loading}
                        error={error}
                        initialState={{
                            sorting: {
                                sortModel: [{ field: "source", sort: "asc" }],
                            },
                        }}
                    />
                </DataGridContainer>
            </MainContent>
        </TableFilterFinalForm>
    );
}

const TargetWrapper = styled("div")`
    max-width: 25vw;
`;

const IconWrapper = styled("div")`
    display: flex;
    flex-direction: row;
`;

const DataGridContainer = styled("div")(() => ({
    height: window.innerHeight - 200,
    width: "100%",
}));
