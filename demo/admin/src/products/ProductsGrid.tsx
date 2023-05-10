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
    GQLProductGridCategoriesQuery,
    GQLProductGridCategoriesQueryVariables,
    GQLProductsListManualFragment,
    GQLProductsListQuery,
    GQLProductsListQueryVariables,
    GQLUpdateProductVisibilityMutation,
    GQLUpdateProductVisibilityMutationVariables,
} from "./ProductsGrid.generated";

function ProductsGridToolbar() {
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

function ProductsGrid() {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };
    const sortModel = dataGridProps.sortModel;
    const client = useApolloClient();
    const { data: categoriesData } = useQuery<GQLProductGridCategoriesQuery, GQLProductGridCategoriesQueryVariables>(productCategoriesQuery);

    const columns: GridColDef<GQLProductsListManualFragment>[] = [
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
        {
            field: "tags",
            headerName: "Tags",
            width: 150,
            renderCell: (params) => <>{params.row.tags.map((tag) => tag.title).join(", ")}</>,
        },
        {
            field: "variants",
            headerName: "Variants",
            width: 150,
            renderCell: (params) => <>{params.row.variants.length}</>,
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
                                            category: input.category?.id,
                                            tags: input.tags.map((tag) => tag.id),
                                            variants: input.variants.map((variant) => ({
                                                name: variant.name,
                                                image: DamImageBlock.state2Output(DamImageBlock.input2State(variant.image)),
                                            })),
                                            articleNumbers: input.articleNumbers,
                                            discounts: input.discounts,
                                            packageDimensions: input.packageDimensions,
                                            statistics: { views: 0 },
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
                                return filter<GQLProductsListManualFragment>(productsFragment, params.row);
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
                    Toolbar: ProductsGridToolbar,
                }}
            />
        </Box>
    );
}

const productsFragment = gql`
    fragment ProductsListManual on Product {
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
        tags {
            id
            title
        }
        variants {
            image
            name
        }
        articleNumbers
        discounts {
            quantity
            price
        }
        packageDimensions {
            width
            height
            depth
        }
    }
`;

const productsQuery = gql`
    query ProductsList($offset: Int, $limit: Int, $sort: [ProductSort!], $filter: ProductFilter, $search: String) {
        products(offset: $offset, limit: $limit, sort: $sort, filter: $filter, search: $search) {
            nodes {
                id
                ...ProductsListManual
            }
            totalCount
        }
    }
    ${productsFragment}
`;

const productCategoriesQuery = gql`
    query ProductGridCategories {
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

export default ProductsGrid;
