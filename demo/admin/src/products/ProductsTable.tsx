import { useApolloClient, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    CrudVisibility,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    Toolbar,
    ToolbarAutomaticTitleItem,
    ToolbarFillSpace,
    ToolbarItem,
    Tooltip,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit, Info } from "@comet/admin-icons";
import { DamImageBlock } from "@comet/cms-admin";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { DataGridPro, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import { filter } from "graphql-anywhere";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import {
    GQLCreateProductMutation,
    GQLCreateProductMutationVariables,
    GQLDeleteProductMutation,
    GQLDeleteProductMutationVariables,
    GQLProductsListFragment,
    GQLProductsListQuery,
    GQLProductsListQueryVariables,
    GQLProductTableCategoriesQuery,
    GQLProductTableCategoriesQueryVariables,
    GQLUpdateProductVisibilityMutation,
    GQLUpdateProductVisibilityMutationVariables,
} from "./ProductsTable.generated";

function ProductsTableToolbar() {
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
                    <FormattedMessage id="products.newProduct" defaultMessage="New Product" />
                </Button>
            </ToolbarItem>
        </Toolbar>
    );
}

function ProductsTable() {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };
    const sortModel = dataGridProps.sortModel;
    const client = useApolloClient();
    const { data: categoriesData } = useQuery<GQLProductTableCategoriesQuery, GQLProductTableCategoriesQueryVariables>(productCategoriesQuery);

    const columns: GridColDef<GQLProductsListFragment>[] = [
        {
            field: "title",
            headerName: "Title",
            width: 150,
            renderHeader: () => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Typography fontWeight={400} fontSize={14}>
                        Title
                    </Typography>
                    <Tooltip
                        trigger="click"
                        title={<FormattedMessage id="comet.products.productTitle.info" defaultMessage="The title/name of the product" />}
                    >
                        <IconButton>
                            <Info />
                        </IconButton>
                    </Tooltip>
                </div>
            ),
        },
        { field: "description", headerName: "Description", width: 150 },
        { field: "price", headerName: "Price", width: 150, type: "number" },
        { field: "type", headerName: "Type", width: 150, type: "singleSelect", valueOptions: ["Cap", "Shirt", "Tie"] },
        {
            field: "category",
            headerName: "Category",
            width: 150,
            renderCell: (params) => <>{params.row.category?.title}</>,
            type: "singleSelect",
            valueOptions: categoriesData?.productCategories.nodes.map((i) => ({ value: i.id, label: i.title })),
        },
        { field: "inStock", headerName: "In Stock", width: 50, type: "boolean" },
        {
            field: "visible",
            headerName: "Visible",
            width: 100,
            type: "boolean",
            renderCell: (params) => {
                return (
                    <CrudVisibility
                        visibility={params.row.visible}
                        onUpdateVisibility={async (visible) => {
                            await client.mutate<GQLUpdateProductVisibilityMutation, GQLUpdateProductVisibilityMutationVariables>({
                                mutation: updateProductVisibilityMutation,
                                variables: { id: params.row.id, visible },
                                optimisticResponse: {
                                    __typename: "Mutation",
                                    updateProductVisibility: { __typename: "Product", id: params.row.id, visible },
                                },
                            });
                        }}
                    />
                );
            },
        },
        {
            field: "action",
            headerName: "",
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                            <Edit color="primary" />
                        </IconButton>
                        <CrudContextMenu
                            onPaste={async ({ input }) => {
                                await client.mutate<GQLCreateProductMutation, GQLCreateProductMutationVariables>({
                                    mutation: createProductMutation,
                                    variables: {
                                        input: {
                                            description: input.description,
                                            image: DamImageBlock.state2Output(DamImageBlock.input2State(input.image)),
                                            inStock: input.inStock,
                                            price: input.price,
                                            slug: input.slug,
                                            title: input.title,
                                            type: input.type,
                                            tags: [], // todo copy tags
                                            category: null, // todo copy category
                                        },
                                    },
                                });
                            }}
                            onDelete={async () => {
                                await client.mutate<GQLDeleteProductMutation, GQLDeleteProductMutationVariables>({
                                    mutation: deleteProductMutation,
                                    variables: { id: params.row.id },
                                });
                            }}
                            refetchQueries={["ProductsList"]}
                            copyData={() => {
                                return filter<GQLProductsListFragment>(productsFragment, params.row);
                            }}
                        />
                    </>
                );
            },
        },
    ];

    const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel),
        },
    });
    const rows = data?.products.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.products.totalCount);

    return (
        <Box sx={{ height: `calc(100vh - var(--comet-admin-master-layout-content-top-spacing))` }}>
            <DataGridPro
                {...dataGridProps}
                disableSelectionOnClick
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                error={error}
                components={{
                    Toolbar: ProductsTableToolbar,
                }}
            />
        </Box>
    );
}

const productsFragment = gql`
    fragment ProductsList on Product {
        id
        slug
        title
        description
        price
        type
        inStock
        image
        visible
        category {
            id
            title
        }
    }
`;

const productsQuery = gql`
    query ProductsList($offset: Int, $limit: Int, $sort: [ProductSort!], $filter: ProductFilter, $search: String) {
        products(offset: $offset, limit: $limit, sort: $sort, filter: $filter, search: $search) {
            nodes {
                id
                ...ProductsList
            }
            totalCount
        }
    }
    ${productsFragment}
`;

const productCategoriesQuery = gql`
    query ProductTableCategories {
        productCategories {
            nodes {
                id
                title
            }
        }
    }
`;

const deleteProductMutation = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id)
    }
`;

const createProductMutation = gql`
    mutation CreateProduct($input: ProductInput!) {
        createProduct(input: $input) {
            id
        }
    }
`;

const updateProductVisibilityMutation = gql`
    mutation UpdateProductVisibility($id: ID!, $visible: Boolean!) {
        updateProductVisibility(id: $id, visible: $visible) {
            id
            visible
        }
    }
`;

export default ProductsTable;
