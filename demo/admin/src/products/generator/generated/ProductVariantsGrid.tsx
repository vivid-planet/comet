// This file has been generated by comet admin-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { GQLProductVariantsGridQuery, GQLProductVariantsGridQueryVariables, GQLProductVariantsGridFutureFragment, GQLDeleteProductVariantMutation, GQLDeleteProductVariantMutationVariables } from "./ProductVariantsGrid.generated";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { Button } from "@comet/admin";
import { CrudContextMenu } from "@comet/admin";
import { DataGridToolbar } from "@comet/admin";
import { GridFilterButton } from "@comet/admin";
import { GridColDef } from "@comet/admin";
import { dataGridDateColumn } from "@comet/admin";
import { muiGridFilterToGql } from "@comet/admin";
import { muiGridSortToGql } from "@comet/admin";
import { StackLink } from "@comet/admin";
import { FillSpace } from "@comet/admin";
import { useBufferedRowCount } from "@comet/admin";
import { useDataGridRemote } from "@comet/admin";
import { usePersistentColumnState } from "@comet/admin";
import { IconButton } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { GridSlotsComponent } from "@mui/x-data-grid-pro";
import { GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import { Add as AddIcon } from "@comet/admin-icons";
import { Edit as EditIcon } from "@comet/admin-icons";
const productVariantsFragment = gql`
        fragment ProductVariantsGridFuture on ProductVariant {
            id
            name createdAt
        }
    `;
const productVariantsQuery = gql`
        query ProductVariantsGrid($product: ID!, $offset: Int!, $limit: Int!, $sort: [ProductVariantSort!], $search: String, $filter: ProductVariantFilter) {
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
function ProductVariantsGridToolbar() {
    return (<DataGridToolbar>
                <GridToolbarQuickFilter />
                <GridFilterButton />
                <FillSpace />
        <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
        <FormattedMessage id="productVariant.productVariantsGridFuture.newEntry" defaultMessage={`New Product Variant`}/>
    </Button>
            </DataGridToolbar>);
}
type Props = {
    product: string;
};
export function ProductVariantsGrid({ product }: Props) {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote({
            queryParamsPrefix: "product-variants",
        }), ...usePersistentColumnState("ProductVariantsGrid") };
    const columns: GridColDef<GQLProductVariantsGridFutureFragment>[] = [
        { field: "name",
            headerName: intl.formatMessage({ id: "productVariant.name", defaultMessage: "Name" }),
            flex: 1,
            minWidth: 150, },
        { ...dataGridDateColumn, field: "createdAt",
            headerName: intl.formatMessage({ id: "productVariant.createdAt", defaultMessage: "Created at" }),
            flex: 1,
            minWidth: 150, },
        { field: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            type: "actions",
            align: "right",
            pinned: "right",
            width: 84,
            renderCell: (params) => {
                return (<>
                                
                                        <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                                            <EditIcon />
                                        </IconButton>
                                        <CrudContextMenu onDelete={async () => {
                        await client.mutate<GQLDeleteProductVariantMutation, GQLDeleteProductVariantMutationVariables>({
                            mutation: deleteProductVariantMutation,
                            variables: { id: params.row.id },
                        });
                    }} refetchQueries={[productVariantsQuery]}/>
                                    
                                </>);
            }, }
    ];
    const { filter: gqlFilter, search: gqlSearch, } = muiGridFilterToGql(columns, dataGridProps.filterModel);
    const { data, loading, error } = useQuery<GQLProductVariantsGridQuery, GQLProductVariantsGridQueryVariables>(productVariantsQuery, {
        variables: {
            product, filter: gqlFilter, search: gqlSearch, offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize, limit: dataGridProps.paginationModel.pageSize, sort: muiGridSortToGql(dataGridProps.sortModel, columns)
        },
    });
    const rowCount = useBufferedRowCount(data?.productVariants.totalCount);
    if (error)
        throw error;
    const rows = data?.productVariants.nodes ?? [];
    return (<DataGridPro {...dataGridProps} rows={rows} rowCount={rowCount} columns={columns} loading={loading} slots={{
            toolbar: ProductVariantsGridToolbar as GridSlotsComponent["toolbar"],
        }}/>);
}
