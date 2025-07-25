// This file has been generated by comet admin-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { GQLProductCategoriesGridQuery, GQLProductCategoriesGridQueryVariables, GQLProductCategoriesGridFragment, GQLUpdateProductCategoryPositionMutation, GQLUpdateProductCategoryPositionMutationVariables, GQLDeleteProductCategoryMutation, GQLDeleteProductCategoryMutationVariables } from "./ProductCategoriesGrid.generated";
import { FormattedMessage } from "react-intl";
import { FormattedNumber } from "react-intl";
import { useIntl } from "react-intl";
import { gql } from "@apollo/client";
import { useApolloClient } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { Button } from "@comet/admin";
import { CrudContextMenu } from "@comet/admin";
import { DataGridToolbar } from "@comet/admin";
import { GridColDef } from "@comet/admin";
import { StackLink } from "@comet/admin";
import { FillSpace } from "@comet/admin";
import { useBufferedRowCount } from "@comet/admin";
import { useDataGridRemote } from "@comet/admin";
import { usePersistentColumnState } from "@comet/admin";
import { IconButton } from "@mui/material";
import { DataGridPro } from "@mui/x-data-grid-pro";
import { GridSlotsComponent } from "@mui/x-data-grid-pro";
import { GridRowOrderChangeParams } from "@mui/x-data-grid-pro";
import { Add as AddIcon } from "@comet/admin-icons";
import { Edit as EditIcon } from "@comet/admin-icons";
const productCategoriesFragment = gql`
        fragment ProductCategoriesGrid on ProductCategory {
            id
            title slug position
        }
    `;
const productCategoriesQuery = gql`
        query ProductCategoriesGrid($offset: Int!, $limit: Int!, $sort: [ProductCategorySort!]) {
    productCategories(offset: $offset, limit: $limit, sort: $sort) {
                nodes {
                    ...ProductCategoriesGrid
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
function ProductCategoriesGridToolbar() {
    return (<DataGridToolbar>
                <FillSpace />
        <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
        <FormattedMessage id="productCategory.productCategoriesGrid.newEntry" defaultMessage={`New Product Category`}/>
    </Button>
            </DataGridToolbar>);
}
export function ProductCategoriesGrid() {
    const client = useApolloClient();
    const intl = useIntl();
    const dataGridProps = { ...useDataGridRemote({
            queryParamsPrefix: "productCategories",
        }), ...usePersistentColumnState("ProductCategoriesGrid") };
    const handleRowOrderChange = async ({ row: { id }, targetIndex }: GridRowOrderChangeParams) => {
        await client.mutate<GQLUpdateProductCategoryPositionMutation, GQLUpdateProductCategoryPositionMutationVariables>({
            mutation: updateProductCategoryPositionMutation,
            variables: { id, input: { position: targetIndex + 1 } },
            awaitRefetchQueries: true,
            refetchQueries: [productCategoriesQuery]
        });
    };
    const columns: GridColDef<GQLProductCategoriesGridFragment>[] = [
        { field: "title",
            headerName: intl.formatMessage({ id: "productCategory.title", defaultMessage: "Title" }),
            filterable: false,
            sortable: false,
            flex: 1,
            minWidth: 150, },
        { field: "slug",
            headerName: intl.formatMessage({ id: "productCategory.slug", defaultMessage: "Slug" }),
            filterable: false,
            sortable: false,
            flex: 1,
            minWidth: 150, },
        { field: "position",
            headerName: intl.formatMessage({ id: "productCategory.position", defaultMessage: "Position" }),
            type: "number",
            filterable: false,
            sortable: false,
            renderCell: ({ value }) => {
                return (typeof value === "number") ? <FormattedNumber value={value} minimumFractionDigits={0} maximumFractionDigits={0}/> : "";
            },
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
                        await client.mutate<GQLDeleteProductCategoryMutation, GQLDeleteProductCategoryMutationVariables>({
                            mutation: deleteProductCategoryMutation,
                            variables: { id: params.row.id },
                        });
                    }} refetchQueries={[productCategoriesQuery]}/>
                                    
                                </>);
            }, }
    ];
    const { data, loading, error } = useQuery<GQLProductCategoriesGridQuery, GQLProductCategoriesGridQueryVariables>(productCategoriesQuery, {
        variables: {
            offset: 0, limit: 100, sort: { field: "position", direction: "ASC" }
        },
    });
    const rowCount = useBufferedRowCount(data?.productCategories.totalCount);
    if (error)
        throw error;
    const rows = data?.productCategories.nodes.map((node) => ({
        ...node,
        __reorder__: node.title
    })) ?? [];
    return (<DataGridPro {...dataGridProps} rows={rows} rowCount={rowCount} columns={columns} loading={loading} slots={{
            toolbar: ProductCategoriesGridToolbar as GridSlotsComponent["toolbar"],
        }} rowReordering onRowOrderChange={handleRowOrderChange} hideFooterPagination/>);
}
