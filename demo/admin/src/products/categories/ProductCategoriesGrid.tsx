import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    Button,
    CrudContextMenu,
    DataGridToolbar,
    FillSpace,
    filterByFragment,
    type GridColDef,
    StackLink,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit as EditIcon } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { DataGridPro, type GridRowOrderChangeParams, type GridSlotsComponent } from "@mui/x-data-grid-pro";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";

import {
    type GQLCreateProductCategoryMutation,
    type GQLCreateProductCategoryMutationVariables,
    type GQLDeleteProductCategoryMutation,
    type GQLDeleteProductCategoryMutationVariables,
    type GQLProductCategoriesGridFutureFragment,
    type GQLProductCategoriesGridQuery,
    type GQLProductCategoriesGridQueryVariables,
    type GQLUpdateProductCategoryPositionMutation,
    type GQLUpdateProductCategoryPositionMutationVariables,
} from "./ProductCategoriesGrid.generated";

const productCategoriesFragment = gql`
    fragment ProductCategoriesGridFuture on ProductCategory {
        id
        title
        slug
        position
    }
`;

const productCategoriesQuery = gql`
    query ProductCategoriesGrid($offset: Int!, $limit: Int!, $sort: [ProductCategorySort!]) {
        productCategories(offset: $offset, limit: $limit, sort: $sort) {
            nodes {
                ...ProductCategoriesGridFuture
            }
            totalCount
        }
    }
    ${productCategoriesFragment}
`;

const updateProductCategoryPositionMutation = gql`
    mutation UpdateProductCategoryPosition($id: ID!, $input: ProductCategoryUpdateInput!) {
        updateProductCategory(id: $id, input: $input) {
            id
            position
            updatedAt
        }
    }
`;

const deleteProductCategoryMutation = gql`
    mutation DeleteProductCategory($id: ID!) {
        deleteProductCategory(id: $id)
    }
`;

const createProductCategoryMutation = gql`
    mutation CreateProductCategory($input: ProductCategoryInput!) {
        createProductCategory(input: $input) {
            id
        }
    }
`;

function ProductCategoriesGridToolbar() {
    return (
        <DataGridToolbar>
            <FillSpace />
            <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                <FormattedMessage id="productCategory.productCategoriesGridFuture.newEntry" defaultMessage="New Product Category" />
            </Button>
        </DataGridToolbar>
    );
}

export function ProductCategoriesGrid() {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote({ queryParamsPrefix: "productCategories" }), ...usePersistentColumnState("ProductCategoriesGrid") };

    const handleRowOrderChange = async ({ row: { id }, targetIndex }: GridRowOrderChangeParams) => {
        await client.mutate<GQLUpdateProductCategoryPositionMutation, GQLUpdateProductCategoryPositionMutationVariables>({
            mutation: updateProductCategoryPositionMutation,
            variables: { id, input: { position: targetIndex + 1 } },
            awaitRefetchQueries: true,
            refetchQueries: [productCategoriesQuery],
        });
    };
    const columns: GridColDef<GQLProductCategoriesGridFutureFragment>[] = [
        {
            field: "title",
            headerName: intl.formatMessage({ id: "productCategory.title", defaultMessage: "Title" }),
            filterable: false,
            sortable: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: "slug",
            headerName: intl.formatMessage({ id: "productCategory.slug", defaultMessage: "Slug" }),
            filterable: false,
            sortable: false,
            flex: 1,
            minWidth: 150,
        },
        {
            field: "position",
            headerName: intl.formatMessage({ id: "productCategory.position", defaultMessage: "Position" }),
            type: "number",
            filterable: false,
            sortable: false,
            renderCell: ({ value }) => {
                return typeof value === "number" ? <FormattedNumber value={value} minimumFractionDigits={0} maximumFractionDigits={0} /> : "";
            },
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
                        <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                            <EditIcon />
                        </IconButton>
                        <CrudContextMenu
                            copyData={() => {
                                // Don't copy id, because we want to create a new entity with this data
                                const { id, ...filteredData } = filterByFragment(productCategoriesFragment, params.row);
                                return filteredData;
                            }}
                            onPaste={async ({ input }) => {
                                await client.mutate<GQLCreateProductCategoryMutation, GQLCreateProductCategoryMutationVariables>({
                                    mutation: createProductCategoryMutation,
                                    variables: { input },
                                });
                            }}
                            onDelete={async () => {
                                await client.mutate<GQLDeleteProductCategoryMutation, GQLDeleteProductCategoryMutationVariables>({
                                    mutation: deleteProductCategoryMutation,
                                    variables: { id: params.row.id },
                                });
                            }}
                            refetchQueries={[productCategoriesQuery]}
                        />
                    </>
                );
            },
        },
    ];

    const { data, loading, error } = useQuery<GQLProductCategoriesGridQuery, GQLProductCategoriesGridQueryVariables>(productCategoriesQuery, {
        variables: {
            offset: 0,
            limit: 100,
            sort: { field: "position", direction: "ASC" },
        },
    });
    const rowCount = useBufferedRowCount(data?.productCategories.totalCount);
    if (error) throw error;
    const rows =
        data?.productCategories.nodes.map((node) => ({
            ...node,
            __reorder__: node.title,
        })) ?? [];

    return (
        <DataGridPro
            {...dataGridProps}
            disableRowSelectionOnClick
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={loading}
            slots={{
                toolbar: ProductCategoriesGridToolbar as GridSlotsComponent["toolbar"],
            }}
            rowReordering
            onRowOrderChange={handleRowOrderChange}
            hideFooterPagination
        />
    );
}
