// This file has been generated by comet admin-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    Button,
    CrudContextMenu,
    DataGridToolbar,
    GridColDef,
    GridFilterButton,
    MainContent,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    ToolbarActions,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { BlockPreviewContent } from "@comet/blocks-admin";
import { DamImageBlock } from "@comet/cms-admin";
import { IconButton } from "@mui/material";
import { DataGridPro, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    GQLCreateProductMutation,
    GQLCreateProductMutationVariables,
    GQLDeleteProductMutation,
    GQLDeleteProductMutationVariables,
    GQLProductsGridQuery,
    GQLProductsGridQueryVariables,
    GQLProductsListFragment,
} from "./ProductsGrid.generated";

const productsFragment = gql`
    fragment ProductsList on Product {
        id
        title
        status
        slug
        description
        type
        price
        inStock
        soldCount
        availableSince
        lastCheckedAt
        createdAt
        updatedAt
        image
    }
`;

const productsQuery = gql`
    query ProductsGrid($offset: Int, $limit: Int, $sort: [ProductSort!], $search: String, $filter: ProductFilter) {
        products(offset: $offset, limit: $limit, sort: $sort, search: $search, filter: $filter) {
            nodes {
                ...ProductsList
            }
            totalCount
        }
    }
    ${productsFragment}
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

function ProductsGridToolbar() {
    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarActions>
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                    <FormattedMessage id="product.newProduct" defaultMessage="New Product" />
                </Button>
            </ToolbarActions>
        </DataGridToolbar>
    );
}

export function ProductsGrid(): React.ReactElement {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };

    const columns: GridColDef<GQLProductsListFragment>[] = [
        { field: "title", headerName: intl.formatMessage({ id: "product.title", defaultMessage: "Title" }), width: 150 },
        {
            field: "status",
            headerName: intl.formatMessage({ id: "product.status", defaultMessage: "Status" }),
            type: "singleSelect",
            valueOptions: [
                { value: "Published", label: intl.formatMessage({ id: "product.status.published", defaultMessage: "Published" }) },
                { value: "Unpublished", label: intl.formatMessage({ id: "product.status.unpublished", defaultMessage: "Unpublished" }) },
                { value: "Deleted", label: intl.formatMessage({ id: "product.status.deleted", defaultMessage: "Deleted" }) },
            ],
            width: 150,
        },
        { field: "slug", headerName: intl.formatMessage({ id: "product.slug", defaultMessage: "Slug" }), width: 150 },
        { field: "description", headerName: intl.formatMessage({ id: "product.description", defaultMessage: "Description" }), width: 150 },
        {
            field: "type",
            headerName: intl.formatMessage({ id: "product.type", defaultMessage: "Type" }),
            type: "singleSelect",
            valueOptions: [
                { value: "Cap", label: intl.formatMessage({ id: "product.type.cap", defaultMessage: "Cap" }) },
                { value: "Shirt", label: intl.formatMessage({ id: "product.type.shirt", defaultMessage: "Shirt" }) },
                { value: "Tie", label: intl.formatMessage({ id: "product.type.tie", defaultMessage: "Tie" }) },
            ],
            width: 150,
        },
        { field: "price", headerName: intl.formatMessage({ id: "product.price", defaultMessage: "Price" }), type: "number", width: 150 },
        { field: "inStock", headerName: intl.formatMessage({ id: "product.inStock", defaultMessage: "In Stock" }), type: "boolean", width: 150 },
        { field: "soldCount", headerName: intl.formatMessage({ id: "product.soldCount", defaultMessage: "Sold Count" }), type: "number", width: 150 },
        {
            field: "availableSince",
            headerName: intl.formatMessage({ id: "product.availableSince", defaultMessage: "Available Since" }),
            type: "date",
            valueGetter: ({ value }) => value && new Date(value),
            width: 150,
        },
        {
            field: "lastCheckedAt",
            headerName: intl.formatMessage({ id: "product.lastCheckedAt", defaultMessage: "Last Checked At" }),
            type: "dateTime",
            valueGetter: ({ value }) => value && new Date(value),
            width: 150,
        },
        {
            field: "createdAt",
            headerName: intl.formatMessage({ id: "product.createdAt", defaultMessage: "Created At" }),
            type: "dateTime",
            valueGetter: ({ value }) => value && new Date(value),
            width: 150,
        },
        {
            field: "updatedAt",
            headerName: intl.formatMessage({ id: "product.updatedAt", defaultMessage: "Updated At" }),
            type: "dateTime",
            valueGetter: ({ value }) => value && new Date(value),
            width: 150,
        },
        {
            field: "image",
            headerName: intl.formatMessage({ id: "product.image", defaultMessage: "Image" }),
            filterable: false,
            sortable: false,
            width: 150,
            renderCell: (params) => {
                return <BlockPreviewContent block={DamImageBlock} input={params.row.image} />;
            },
        },
        {
            field: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            type: "actions",
            renderCell: (params) => {
                return (
                    <>
                        <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                            <Edit color="primary" />
                        </IconButton>
                        <CrudContextMenu
                            copyData={() => {
                                const row = params.row;
                                return {
                                    title: row.title,
                                    status: row.status,
                                    slug: row.slug,
                                    description: row.description,
                                    type: row.type,
                                    price: row.price,
                                    inStock: row.inStock,
                                    availableSince: row.availableSince,
                                    lastCheckedAt: row.lastCheckedAt,
                                    image: DamImageBlock.state2Output(DamImageBlock.input2State(row.image)),
                                };
                            }}
                            onPaste={async ({ input }) => {
                                await client.mutate<GQLCreateProductMutation, GQLCreateProductMutationVariables>({
                                    mutation: createProductMutation,
                                    variables: { input },
                                });
                            }}
                            onDelete={async () => {
                                await client.mutate<GQLDeleteProductMutation, GQLDeleteProductMutationVariables>({
                                    mutation: deleteProductMutation,
                                    variables: { id: params.row.id },
                                });
                            }}
                            refetchQueries={[productsQuery]}
                        />
                    </>
                );
            },
        },
    ];

    const { filter: gqlFilter, search: gqlSearch } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const { data, loading, error } = useQuery<GQLProductsGridQuery, GQLProductsGridQueryVariables>(productsQuery, {
        variables: {
            filter: gqlFilter,
            search: gqlSearch,
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(dataGridProps.sortModel),
        },
    });
    const rowCount = useBufferedRowCount(data?.products.totalCount);
    if (error) throw error;
    const rows = data?.products.nodes ?? [];

    return (
        <MainContent fullHeight>
            <DataGridPro
                {...dataGridProps}
                disableSelectionOnClick
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                components={{
                    Toolbar: ProductsGridToolbar,
                }}
            />
        </MainContent>
    );
}
