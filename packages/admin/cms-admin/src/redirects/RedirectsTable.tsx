import { useQuery } from "@apollo/client";
import {
    GridFilterButton,
    LocalErrorScopeApolloContext,
    muiGridFilterToGql,
    muiGridPagingToGql,
    muiGridSortToGql,
    StackLink,
    StackSwitchApiContext,
    TableDeleteButton,
    Toolbar,
    ToolbarAutomaticTitleItem,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Delete as DeleteIcon, Edit } from "@comet/admin-icons";
import { BlockInterface, BlockPreview } from "@comet/blocks-admin";
import { Button, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DataGrid, getGridSingleSelectOperators, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { GQLPaginatedRedirectsQuery, GQLPaginatedRedirectsQueryVariables, namedOperations } from "../graphql.generated";
import RedirectActiveness from "./RedirectActiveness";
import { deleteRedirectMutation, paginatedRedirectsQuery } from "./RedirectsTable.gql";

interface Props {
    linkBlock: BlockInterface;
    scope: Record<string, unknown>;
}

function RedirectsTableToolbar() {
    return (
        <Toolbar>
            <ToolbarAutomaticTitleItem />
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarItem>
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                    <FormattedMessage id="comet.pages.redirects.add" defaultMessage="Add" />
                </Button>
            </ToolbarItem>
        </Toolbar>
    );
}

export function RedirectsTable({ linkBlock, scope }: Props): JSX.Element {
    const intl = useIntl();

    const typeOptions = [
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

    const stackApi = React.useContext(StackSwitchApiContext);

    const columns: GridColDef[] = [
        {
            field: "source",
            headerName: intl.formatMessage({ id: "comet.pages.redirects.redirect.source", defaultMessage: "Source" }),
            sortable: true,
            minWidth: 600,
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
            minWidth: 400,
            filterable: false,
        },
        {
            field: "comment",
            headerName: intl.formatMessage({ id: "comet.pages.redirects.redirect.comment", defaultMessage: "Comment" }),
            renderCell: (params) => <div>{params.value}</div>,
            sortable: false,
            flex: 1,
            minWidth: 400,
            filterable: false,
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
            filterOperators: getGridSingleSelectOperators(),
            type: "singleSelect",
            valueOptions: typeOptions,
        },
        {
            field: "active",
            headerName: intl.formatMessage({
                id: "comet.pages.redirects.redirect.activation",
                defaultMessage: "Activation",
            }),
            renderCell: (params) => <RedirectActiveness redirect={params.row} />,
            sortable: false,
            flex: 1,
            type: "boolean",
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
            filterable: false,
        },
    ];

    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("RedirectsGrid") };
    const sortModel = dataGridProps.sortModel;

    const { data, loading, error } = useQuery<GQLPaginatedRedirectsQuery, GQLPaginatedRedirectsQueryVariables>(paginatedRedirectsQuery, {
        variables: {
            scope,
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            ...muiGridPagingToGql({ page: dataGridProps.page, pageSize: dataGridProps.pageSize }),
            sort: muiGridSortToGql(sortModel),
        },
        context: LocalErrorScopeApolloContext,
        fetchPolicy: "cache-and-network",
    });

    const rows = data?.paginatedRedirects.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.paginatedRedirects.totalCount);

    return (
        <DataGridContainer>
            <DataGrid
                {...dataGridProps}
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                error={error}
                disableSelectionOnClick
                components={{ Toolbar: RedirectsTableToolbar }}
            />
        </DataGridContainer>
    );
}

const TargetWrapper = styled("div")`
    max-width: 25vw;
`;

const IconWrapper = styled("div")`
    display: flex;
    flex-direction: row;
`;

const DataGridContainer = styled("div")`
    width: 100%;
    height: calc(100vh - var(--comet-admin-master-layout-content-top-spacing));
`;
