import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    Button,
    CrudContextMenu,
    DataGridToolbar,
    FillSpace,
    filterByFragment,
    type GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit as EditIcon } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGridPro, type GridSlotsComponent, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import { FormattedMessage, useIntl } from "react-intl";

import {
    type GQLCreateProductTagMutation,
    type GQLCreateProductTagMutationVariables,
    type GQLDeleteProductTagMutation,
    type GQLDeleteProductTagMutationVariables,
    type GQLProductTagsGridFragment,
    type GQLProductTagsGridQuery,
    type GQLProductTagsGridQueryVariables,
} from "./ProductTagsGrid.generated";

const productTagsFragment = gql`
    fragment ProductTagsGrid on ProductTag {
        id
        title
    }
`;
const productTagsQuery = gql`
    query ProductTagsGrid($offset: Int!, $limit: Int!, $sort: [ProductTagSort!], $search: String, $filter: ProductTagFilter) {
        productTags(offset: $offset, limit: $limit, sort: $sort, search: $search, filter: $filter) {
            nodes {
                ...ProductTagsGrid
            }
            totalCount
        }
    }
    ${productTagsFragment}
`;
const deleteProductTagMutation = gql`
    mutation DeleteProductTag($id: ID!) {
        deleteProductTag(id: $id)
    }
`;
const createProductTagMutation = gql`
    mutation CreateProductTag($input: ProductTagInput!) {
        createProductTag(input: $input) {
            id
        }
    }
`;
function ProductTagsGridToolbar() {
    return (
        <DataGridToolbar>
            <GridToolbarQuickFilter />
            <GridFilterButton />
            <FillSpace />
            <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                <FormattedMessage id="productTag.productTagsGrid.newEntry" defaultMessage="New Product Tag" />
            </Button>
        </DataGridToolbar>
    );
}
export function ProductTagsGrid() {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = {
        ...useDataGridRemote({
            queryParamsPrefix: "productTags",
        }),
        ...usePersistentColumnState("ProductTagsGrid"),
    };
    const columns: GridColDef<GQLProductTagsGridFragment>[] = [
        { field: "title", headerName: intl.formatMessage({ id: "productTag.title", defaultMessage: "Title" }), flex: 1, minWidth: 150 },
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
                        <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                            <EditIcon />
                        </IconButton>
                        <CrudContextMenu
                            copyData={() => {
                                // Don't copy id, because we want to create a new entity with this data
                                const { id, ...filteredData } = filterByFragment(productTagsFragment, params.row);
                                return filteredData;
                            }}
                            onPaste={async ({ input }) => {
                                await client.mutate<GQLCreateProductTagMutation, GQLCreateProductTagMutationVariables>({
                                    mutation: createProductTagMutation,
                                    variables: { input },
                                });
                            }}
                            onDelete={async () => {
                                await client.mutate<GQLDeleteProductTagMutation, GQLDeleteProductTagMutationVariables>({
                                    mutation: deleteProductTagMutation,
                                    variables: { id: params.row.id },
                                });
                            }}
                            refetchQueries={[productTagsQuery]}
                        />
                    </>
                );
            },
        },
    ];
    const { filter: gqlFilter, search: gqlSearch } = muiGridFilterToGql(columns, dataGridProps.filterModel);
    const { data, loading, error } = useQuery<GQLProductTagsGridQuery, GQLProductTagsGridQueryVariables>(productTagsQuery, {
        variables: {
            filter: gqlFilter,
            search: gqlSearch,
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            sort: muiGridSortToGql(dataGridProps.sortModel, columns),
        },
    });
    const rowCount = useBufferedRowCount(data?.productTags.totalCount);
    if (error) throw error;
    const rows = data?.productTags.nodes ?? [];
    return (
        <DataGridPro
            {...dataGridProps}
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={loading}
            slots={{
                toolbar: ProductTagsGridToolbar as GridSlotsComponent["toolbar"],
            }}
        />
    );
}
