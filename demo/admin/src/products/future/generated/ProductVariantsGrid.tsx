// This file has been generated by comet admin-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    filterByFragment,
    GridColDef,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    Toolbar,
    ToolbarActions,
    ToolbarAutomaticTitleItem,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit } from "@comet/admin-icons";
import { DamImageBlock } from "@comet/cms-admin";
import { Button, IconButton } from "@mui/material";
import { DataGridPro, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
    GQLCreateProductVariantMutation,
    GQLCreateProductVariantMutationVariables,
    GQLDeleteProductVariantMutation,
    GQLDeleteProductVariantMutationVariables,
    GQLProductVariantsGridFutureFragment,
    GQLProductVariantsGridQuery,
    GQLProductVariantsGridQueryVariables,
} from "./ProductVariantsGrid.generated";

const productVariantsFragment = gql`
    fragment ProductVariantsGridFuture on ProductVariant {
        id
        name
        createdAt
    }
`;

const productVariantsQuery = gql`
    query ProductVariantsGrid(
        $product: ID!
        $offset: Int!
        $limit: Int!
        $sort: [ProductVariantSort!]
        $search: String
        $filter: ProductVariantFilter
    ) {
        productVariants(product: $product, offset: $offset, limit: $limit, sort: $sort, search: $search, filter: $filter) {
            nodes {
                ...ProductVariantsGridFuture
            }
            totalCount
        }
    }
    ${productVariantsFragment}
`;

const deleteProductVariantMutation = gql`
    mutation DeleteProductVariant($id: ID!) {
        deleteProductVariant(id: $id)
    }
`;

const createProductVariantMutation = gql`
    mutation CreateProductVariant($product: ID!, $input: ProductVariantInput!) {
        createProductVariant(product: $product, input: $input) {
            id
        }
    }
`;

function ProductVariantsGridToolbar() {
    return (
        <Toolbar>
            <ToolbarAutomaticTitleItem />
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarActions>
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                    <FormattedMessage id="productVariant.newProductVariant" defaultMessage="New Product Variant" />
                </Button>
            </ToolbarActions>
        </Toolbar>
    );
}

type Props = {
    product: string;
};

export function ProductVariantsGrid({ product }: Props): React.ReactElement {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductVariantsGrid") };

    const columns: GridColDef<GQLProductVariantsGridFutureFragment>[] = [
        { field: "name", headerName: intl.formatMessage({ id: "productVariant.name", defaultMessage: "Name" }), flex: 1, minWidth: 150 },
        {
            field: "createdAt",
            headerName: intl.formatMessage({ id: "productVariant.createdAt", defaultMessage: "Created at" }),
            type: "date",
            valueGetter: ({ row }) => row.createdAt && new Date(row.createdAt),
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
            renderCell: (params) => {
                return (
                    <>
                        <IconButton component={StackLink} pageName="edit" payload={params.row.id}>
                            <Edit color="primary" />
                        </IconButton>
                        <CrudContextMenu
                            copyData={() => {
                                // Don't copy id, because we want to create a new entity with this data
                                const { id, ...filteredData } = filterByFragment(productVariantsFragment, params.row);
                                return {
                                    ...filteredData,
                                    image: DamImageBlock.state2Output(DamImageBlock.input2State(filteredData.image)),
                                };
                            }}
                            onPaste={async ({ input }) => {
                                await client.mutate<GQLCreateProductVariantMutation, GQLCreateProductVariantMutationVariables>({
                                    mutation: createProductVariantMutation,
                                    variables: { product, input },
                                });
                            }}
                            onDelete={async () => {
                                await client.mutate<GQLDeleteProductVariantMutation, GQLDeleteProductVariantMutationVariables>({
                                    mutation: deleteProductVariantMutation,
                                    variables: { id: params.row.id },
                                });
                            }}
                            refetchQueries={[productVariantsQuery]}
                        />
                    </>
                );
            },
        },
    ];

    const { filter: gqlFilter, search: gqlSearch } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const { data, loading, error } = useQuery<GQLProductVariantsGridQuery, GQLProductVariantsGridQueryVariables>(productVariantsQuery, {
        variables: {
            product,
            filter: gqlFilter,
            search: gqlSearch,
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(dataGridProps.sortModel),
        },
    });
    const rowCount = useBufferedRowCount(data?.productVariants.totalCount);
    if (error) throw error;
    const rows = data?.productVariants.nodes ?? [];

    return (
        <DataGridPro
            {...dataGridProps}
            disableSelectionOnClick
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={loading}
            components={{
                Toolbar: ProductVariantsGridToolbar,
            }}
        />
    );
}