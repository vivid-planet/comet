import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    DataGridToolbar,
    filterByFragment,
    type GridColDef,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { useTheme } from "@mui/material";
import { DataGridPro, type GridRenderCellParams, type GridRowOrderChangeParams, type GridToolbarProps } from "@mui/x-data-grid-pro";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import {
    type GQLCreateProductCategoryMutation,
    type GQLCreateProductCategoryMutationVariables,
    type GQLDeleteProductCategoryMutation,
    type GQLDeleteProductCategoryMutationVariables,
    type GQLProductCategoriesGridQuery,
    type GQLProductCategoriesGridQueryVariables,
    type GQLProductCategoryGridFutureFragment,
    type GQLUpdateProductCategoryPositionMutation,
    type GQLUpdateProductCategoryPositionMutationVariables,
} from "./ProductCategoriesGrid.generated";

const productCategoriesFragment = gql`
    fragment ProductCategoryGridFuture on ProductCategory {
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
                ...ProductCategoryGridFuture
            }
            totalCount
        }
    }
    ${productCategoriesFragment}
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

const updateProductCategoryPositionMutation = gql`
    mutation UpdateProductCategoryPosition($id: ID!, $input: ProductCategoryUpdateInput!) {
        updateProductCategory(id: $id, input: $input) {
            id
            updatedAt
            position
        }
    }
`;

interface ProductCategoriesGridToolbarProps extends GridToolbarProps {
    toolbarAction?: ReactNode;
}

function ProductCategoriesGridToolbar({ toolbarAction }: ProductCategoriesGridToolbarProps) {
    return <DataGridToolbar>{toolbarAction}</DataGridToolbar>;
}

type Props = {
    toolbarAction?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowAction?: (params: GridRenderCellParams<any, GQLProductCategoryGridFutureFragment, any>) => ReactNode;
    actionsColumnWidth?: number;
};

export function ProductCategoriesGrid({ toolbarAction, rowAction, actionsColumnWidth = 52 }: Props) {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductCategoriesGrid") };

    const handleRowOrderChange = async ({ row: { id }, targetIndex }: GridRowOrderChangeParams) => {
        await client.mutate<GQLUpdateProductCategoryPositionMutation, GQLUpdateProductCategoryPositionMutationVariables>({
            mutation: updateProductCategoryPositionMutation,
            variables: { id, input: { position: targetIndex + 1 } },
            awaitRefetchQueries: true,
            refetchQueries: [productCategoriesQuery],
        });
    };

    const theme = useTheme();

    const columns: GridColDef<GQLProductCategoryGridFutureFragment>[] = [
        {
            field: "title",
            headerName: intl.formatMessage({ id: "productCategory.title", defaultMessage: "Titel" }),
            flex: 1,
            visible: theme.breakpoints.up("md"),
            minWidth: 150,
            filterable: false,
            sortable: false,
        },
        {
            field: "slug",
            headerName: intl.formatMessage({ id: "productCategory.slug", defaultMessage: "Slug" }),
            flex: 1,
            minWidth: 150,
            filterable: false,
            sortable: false,
        },
        {
            field: "position",
            headerName: intl.formatMessage({ id: "productCategory.position", defaultMessage: "Position" }),
            type: "number",
            filterable: false,
            sortable: false,
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
            width: actionsColumnWidth,
            renderCell: (params) => {
                return (
                    <>
                        {rowAction && rowAction(params)}
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
                toolbar: ProductCategoriesGridToolbar,
            }}
            slotProps={{
                toolbar: { toolbarAction } as ProductCategoriesGridToolbarProps,
            }}
            rowReordering
            onRowOrderChange={handleRowOrderChange}
            hideFooterPagination
        />
    );
}
