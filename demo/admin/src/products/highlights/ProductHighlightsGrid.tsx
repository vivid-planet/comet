import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    Button,
    CrudContextMenu,
    DataGridToolbar,
    FillSpace,
    type GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
    useStackSwitchApi,
} from "@comet/admin";
import { Add as AddIcon, Edit as EditIcon } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGridPro, type GridSlotsComponent, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import { useCallback } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    type GQLDeleteProductHighlightMutation,
    type GQLDeleteProductHighlightMutationVariables,
    type GQLProductHighlightsFormFragment,
    type GQLProductHighlightsGridQuery,
    type GQLProductHighlightsGridQueryVariables,
} from "./ProductHighlightsGrid.generated";

const productHighlightsFragment = gql`
    fragment ProductHighlightsForm on ProductHighlight {
        id
        description
    }
`;
const productHighlightsQuery = gql`
    query ProductHighlightsGrid($offset: Int!, $limit: Int!, $sort: [ProductHighlightSort!], $search: String, $filter: ProductHighlightFilter) {
        productHighlights(offset: $offset, limit: $limit, sort: $sort, search: $search, filter: $filter) {
            nodes {
                ...ProductHighlightsForm
            }
            totalCount
        }
    }
    ${productHighlightsFragment}
`;
const deleteProductHighlightMutation = gql`
    mutation DeleteProductHighlight($id: ID!) {
        deleteProductHighlight(id: $id)
    }
`;
function ProductHighlightsGridToolbar() {
    return (
        <DataGridToolbar>
            <GridToolbarQuickFilter />
            <GridFilterButton />
            <FillSpace />
            <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                <FormattedMessage id="productHighlight.productHighlightsForm.newEntry" defaultMessage="New Product Highlight" />
            </Button>
        </DataGridToolbar>
    );
}
export function ProductHighlightsGrid() {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductHighlightsGrid") };
    const stackSwitchApi = useStackSwitchApi();

    const handleRowPrimaryAction = useCallback(
        (row: GQLProductHighlightsFormFragment) => {
            stackSwitchApi.activatePage("edit", row.id);
        },
        [stackSwitchApi],
    );

    const columns: GridColDef<GQLProductHighlightsFormFragment>[] = [
        {
            field: "description",
            headerName: intl.formatMessage({ id: "productHighlight.description", defaultMessage: "Description" }),
            flex: 1,
            minWidth: 150,
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            type: "actions",
            align: "right",
            pinned: "right",
            width: 84,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton color="primary" onClick={() => handleRowPrimaryAction(params.row)}>
                            <EditIcon />
                        </IconButton>
                        <CrudContextMenu
                            onDelete={async () => {
                                await client.mutate<GQLDeleteProductHighlightMutation, GQLDeleteProductHighlightMutationVariables>({
                                    mutation: deleteProductHighlightMutation,
                                    variables: { id: params.row.id },
                                });
                            }}
                            refetchQueries={[productHighlightsQuery]}
                        />
                    </>
                );
            },
        },
    ];
    const { filter: gqlFilter, search: gqlSearch } = muiGridFilterToGql(columns, dataGridProps.filterModel);
    const { data, loading, error } = useQuery<GQLProductHighlightsGridQuery, GQLProductHighlightsGridQueryVariables>(productHighlightsQuery, {
        variables: {
            filter: gqlFilter,
            search: gqlSearch,
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            sort: muiGridSortToGql(dataGridProps.sortModel, columns),
        },
    });
    const rowCount = useBufferedRowCount(data?.productHighlights.totalCount);
    if (error) throw error;
    const rows = data?.productHighlights.nodes ?? [];
    return (
        <DataGridPro
            {...dataGridProps}
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={loading}
            onRowClick={(params) => handleRowPrimaryAction(params.row)}
            slots={{
                toolbar: ProductHighlightsGridToolbar as GridSlotsComponent["toolbar"],
            }}
        />
    );
}
