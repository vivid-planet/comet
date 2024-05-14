import { useApolloClient, useQuery } from "@apollo/client";
import {
    CrudVisibility,
    filterByFragment,
    GridFilterButton,
    MainContent,
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
    useGetCrudActions,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Info, View } from "@comet/admin-icons";
import { DamImageBlock } from "@comet/cms-admin";
import { Button, IconButton, Typography } from "@mui/material";
import { DataGridPro, GridEnrichedColDef, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
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
    GQLUpdateProductStatusMutation,
    GQLUpdateProductStatusMutationVariables,
} from "./ProductsGrid.generated";
import { ProductsGridPreviewAction } from "./ProductsGridPreviewAction";

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

export function ProductsGrid() {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };
    const sortModel = dataGridProps.sortModel;
    const client = useApolloClient();
    const { data: categoriesData } = useQuery<GQLProductGridCategoriesQuery, GQLProductGridCategoriesQueryVariables>(productCategoriesQuery);

    const getCrudActions = useGetCrudActions();

    const columns: GridEnrichedColDef<GQLProductsListManualFragment>[] = [
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
            field: "status",
            headerName: "Status",
            width: 100,
            type: "boolean",
            valueGetter: (params) => params.row.status == "Published",
            renderCell: (params) => {
                return (
                    <CrudVisibility
                        visibility={params.row.status == "Published"}
                        onUpdateVisibility={async (status) => {
                            await client.mutate<GQLUpdateProductStatusMutation, GQLUpdateProductStatusMutationVariables>({
                                mutation: updateProductStatusMutation,
                                variables: { id: params.row.id, status: status ? "Published" : "Unpublished" },
                                optimisticResponse: {
                                    __typename: "Mutation",
                                    updateProduct: { __typename: "Product", id: params.row.id, status: status ? "Published" : "Unpublished" },
                                },
                            });
                        }}
                    />
                );
            },
        },
        {
            field: "actions",
            type: "actions",
            headerName: "",
            width: 106,
            getActions: (params) => [
                ...getCrudActions({
                    // TODO: Remove the need to define the type of `input`
                    onPaste: async ({ input }: { input: GQLProductsListManualFragment }) => {
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
                                    colors: input.colors,
                                    articleNumbers: input.articleNumbers,
                                    discounts: input.discounts,
                                    statistics: { views: 0 },
                                },
                            },
                        });
                    },
                    onDelete: async () => {
                        await client.mutate<GQLDeleteProductMutation, GQLDeleteProductMutationVariables>({
                            mutation: deleteProductMutation,
                            variables: { id: params.row.id },
                        });
                    },
                    refetchQueries: ["ProductsList"],
                    copyData: async () => {
                        return filterByFragment<GQLProductsListManualFragment>(productsFragment, params.row);
                    },
                }),
                // @ts-expect-error TODO: The `getActions` type does not allow custom props, such as `product`
                <ProductsGridPreviewAction key="view-details" label="View Details" icon={<View />} product={params.row} />,
            ],
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
        <MainContent fullHeight disablePadding>
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
        </MainContent>
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
        status
        category {
            id
            title
        }
        tags {
            id
            title
        }
        colors {
            name
            hexCode
        }
        variants {
            id
        }
        articleNumbers
        discounts {
            quantity
            price
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

const updateProductStatusMutation = gql`
    mutation UpdateProductStatus($id: ID!, $status: ProductStatus!) {
        updateProduct(id: $id, input: { status: $status }) {
            id
            status
        }
    }
`;
