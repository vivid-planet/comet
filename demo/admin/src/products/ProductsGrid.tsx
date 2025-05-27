import { useApolloClient, useQuery } from "@apollo/client";
import {
    Button,
    CrudContextMenu,
    CrudMoreActionsMenu,
    CrudVisibility,
    dataGridDateColumn,
    DataGridToolbar,
    type ExportApi,
    FillSpace,
    filterByFragment,
    GridCellContent,
    type GridColDef,
    GridColumnsButton,
    GridFilterButton,
    messages,
    muiGridFilterToGql,
    muiGridSortToGql,
    renderStaticSelectCell,
    StackLink,
    useBufferedRowCount,
    useDataGridExcelExport,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Disabled, Edit, Excel, Online, StateFilled as StateFilledIcon } from "@comet/admin-icons";
import { DamImageBlock } from "@comet/cms-admin";
import { CircularProgress, IconButton, useTheme } from "@mui/material";
import {
    DataGridPro,
    GridFilterInputSingleSelect,
    GridFilterInputValue,
    type GridRowSelectionModel,
    type GridSlotsComponent,
    GridToolbarQuickFilter,
} from "@mui/x-data-grid-pro";
import gql from "graphql-tag";
import { useState } from "react";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";

import { PublishAllProducts } from "./helpers/PublishAllProducts";
import { ManufacturerFilterOperator } from "./ManufacturerFilter";
import {
    type GQLCreateProductMutation,
    type GQLCreateProductMutationVariables,
    type GQLDeleteProductMutation,
    type GQLDeleteProductMutationVariables,
    type GQLProductGridRelationsQuery,
    type GQLProductGridRelationsQueryVariables,
    type GQLProductsListManualFragment,
    type GQLProductsListQuery,
    type GQLProductsListQueryVariables,
    type GQLUpdateProductStatusMutation,
    type GQLUpdateProductStatusMutationVariables,
} from "./ProductsGrid.generated";
import { ProductsGridPreviewAction } from "./ProductsGridPreviewAction";

type ProductsGridToolbarProps = {
    exportApi: ExportApi;
    selectionModel: GridRowSelectionModel;
};

function ProductsGridToolbar({ exportApi, selectionModel }: ProductsGridToolbarProps) {
    const client = useApolloClient();
    const theme = useTheme();

    return (
        <DataGridToolbar>
            <GridToolbarQuickFilter />
            <GridFilterButton />
            <GridColumnsButton />
            <FillSpace />
            <CrudMoreActionsMenu
                overallActions={[
                    {
                        label: <FormattedMessage {...messages.downloadAsExcel} />,
                        icon: exportApi.loading ? <CircularProgress size={20} /> : <Excel />,
                        onClick: () => exportApi.exportGrid(),
                        disabled: exportApi.loading,
                    },
                    <PublishAllProducts key="publish" />,
                ]}
                selectiveActions={[
                    {
                        label: "Publish",
                        icon: <Online htmlColor={theme.palette.success.main} />,
                        onClick: () => {
                            for (const id of selectionModel) {
                                client.mutate<GQLUpdateProductStatusMutation, GQLUpdateProductStatusMutationVariables>({
                                    mutation: updateProductStatusMutation,
                                    variables: { id: id as string, status: "Published" },
                                    optimisticResponse: {
                                        __typename: "Mutation",
                                        updateProduct: { __typename: "Product", id: id as string, status: "Published" },
                                    },
                                });
                            }
                        },
                    },
                    {
                        label: "Unpublish",
                        icon: <Disabled />,
                        onClick: () => {
                            for (const id of selectionModel) {
                                client.mutate<GQLUpdateProductStatusMutation, GQLUpdateProductStatusMutationVariables>({
                                    mutation: updateProductStatusMutation,
                                    variables: { id: id as string, status: "Unpublished" },
                                    optimisticResponse: {
                                        __typename: "Mutation",
                                        updateProduct: { __typename: "Product", id: id as string, status: "Unpublished" },
                                    },
                                });
                            }
                        },
                    },
                ]}
                selectionSize={selectionModel.length}
            />
            <Button responsive startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add">
                <FormattedMessage id="products.newProduct" defaultMessage="New Product" />
            </Button>
        </DataGridToolbar>
    );
}

export function ProductsGrid() {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };
    const sortModel = dataGridProps.sortModel;
    const client = useApolloClient();
    const { data: relationsData } = useQuery<GQLProductGridRelationsQuery, GQLProductGridRelationsQueryVariables>(productRelationsQuery);
    const intl = useIntl();
    const theme = useTheme();
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

    const columns: GridColDef<GQLProductsListManualFragment>[] = [
        {
            field: "overview",
            headerName: "Overview",
            minWidth: 200,
            flex: 1,
            sortBy: ["title", "price", "type", "category", "inStock"],
            visible: theme.breakpoints.down("md"),
            renderCell: ({ row }) => {
                const secondaryValues = [
                    typeof row.price === "number" && intl.formatNumber(row.price, { style: "currency", currency: "EUR" }),
                    row.type,
                    row.category?.title,
                    row.inStock
                        ? intl.formatMessage({ id: "comet.products.product.inStock", defaultMessage: "In stock" })
                        : intl.formatMessage({ id: "comet.products.product.outOfStock", defaultMessage: "Out of stock" }),
                ];
                return <GridCellContent primaryText={row.title} secondaryText={secondaryValues.filter(Boolean).join(" • ")} />;
            },
            disableExport: true,
        },
        {
            field: "title",
            headerName: "Title",
            minWidth: 150,
            flex: 1,
            visible: theme.breakpoints.up("md"),
        },
        { field: "description", headerName: "Description", flex: 1, minWidth: 150 },
        {
            field: "price",
            headerName: "Price",
            minWidth: 100,
            flex: 1,
            type: "number",
            visible: theme.breakpoints.up("md"),
            renderCell: ({ row }) => (typeof row.price === "number" ? <FormattedNumber value={row.price} style="currency" currency="EUR" /> : "-"),
        },
        {
            field: "type",
            headerName: "Type",
            width: 100,
            type: "singleSelect",
            visible: theme.breakpoints.up("md"),
            valueOptions: ["Cap", "Shirt", "Tie"],
        },
        {
            field: "additionalTypes",
            headerName: "Additional Types",
            width: 150,
            renderCell: (params) => <>{params.row.additionalTypes.join(", ")}</>,
            filterOperators: [
                {
                    value: "contains",
                    getApplyFilterFn: (filterItem) => {
                        throw new Error("not implemented, we filter server side");
                    },
                    InputComponent: GridFilterInputSingleSelect,
                },
            ],
            valueOptions: ["Cap", "Shirt", "Tie"],
            disableExport: true,
        },
        {
            field: "category",
            headerName: "Category",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => <>{params.row.category?.title}</>,
            type: "singleSelect",
            visible: theme.breakpoints.up("md"),
            valueOptions: relationsData?.productCategories.nodes.map((i) => ({ value: i.id, label: i.title })),
            disableExport: true,
        },
        {
            field: "tags",
            headerName: "Tags",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.row.tags.map((tag) => tag.title).join(", ")}</>,
            filterOperators: [
                {
                    label: "Search",
                    value: "search",
                    getApplyFilterFn: (filterItem) => {
                        throw new Error("not implemented, we filter server side");
                    },
                    InputComponent: GridFilterInputValue,
                },
            ],
            disableExport: true,
        },
        {
            field: "inStock",
            headerName: intl.formatMessage({ id: "product.inStock", defaultMessage: "In Stock" }),
            type: "singleSelect",
            valueOptions: [
                {
                    value: true,
                    label: intl.formatMessage({ id: "product.inStock.true.primary", defaultMessage: "In stock" }),
                    cellContent: (
                        <GridCellContent
                            primaryText={<FormattedMessage id="product.inStock.true.primary" defaultMessage="In stock" />}
                            icon={<StateFilledIcon color="success" />}
                        />
                    ),
                },
                {
                    value: false,
                    label: intl.formatMessage({ id: "product.inStock.false.primary", defaultMessage: "Out of stock" }),
                    cellContent: (
                        <GridCellContent
                            primaryText={<FormattedMessage id="product.inStock.false.primary" defaultMessage="Out of stock" />}
                            icon={<StateFilledIcon color="error" />}
                        />
                    ),
                },
            ],
            renderCell: renderStaticSelectCell,
            flex: 1,
            minWidth: 80,
            disableExport: true,
        },
        {
            ...dataGridDateColumn,
            field: "availableSince",
            headerName: "Available Since",
            width: 130,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            minWidth: 130,
            type: "boolean",
            valueGetter: (params, row) => row.status == "Published",
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
            disableExport: true,
        },
        {
            field: "manufacturer",
            headerName: intl.formatMessage({ id: "products.manufacturer", defaultMessage: "Manufacturer" }),
            sortable: false,
            valueGetter: (params, row) => row.manufacturer?.name,
            filterOperators: [ManufacturerFilterOperator],
            disableExport: true,
        },
        {
            field: "actions",
            type: "actions",
            headerName: "",
            sortable: false,
            filterable: false,
            width: 116,
            pinned: "right",
            renderCell: (params) => {
                return (
                    <>
                        <ProductsGridPreviewAction {...params} />
                        <IconButton color="primary" component={StackLink} pageName="edit" payload={params.row.id}>
                            <Edit />
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
                                            colors: input.colors,
                                            articleNumbers: input.articleNumbers,
                                            discounts: input.discounts,
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
                                return filterByFragment<GQLProductsListManualFragment>(productsFragment, params.row);
                            }}
                        />
                    </>
                );
            },
            disableExport: true,
        },
    ];

    const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.paginationModel.page * dataGridProps.paginationModel.pageSize,
            limit: dataGridProps.paginationModel.pageSize,
            sort: muiGridSortToGql(sortModel, columns),
        },
    });
    if (error) {
        throw error;
    }
    const rows = data?.products.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.products.totalCount);

    const exportApi = useDataGridExcelExport<
        GQLProductsListQuery["products"]["nodes"][0],
        GQLProductsListQuery,
        Omit<GQLProductsListQueryVariables, "offset" | "limit">
    >({
        columns,
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
        },
        query: productsQuery,
        resolveQueryNodes: (data) => data.products.nodes,
        totalCount: data?.products.totalCount ?? 0,
        exportOptions: {
            fileName: "Products",
        },
    });

    return (
        <DataGridPro
            {...dataGridProps}
            rows={rows}
            rowCount={rowCount}
            columns={columns}
            loading={loading}
            slots={{
                toolbar: ProductsGridToolbar as GridSlotsComponent["toolbar"],
            }}
            slotProps={{
                toolbar: { exportApi, selectionModel } as ProductsGridToolbarProps,
            }}
            checkboxSelection
            keepNonExistentRowsSelected
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(selectionModel) => {
                setSelectionModel(selectionModel);
            }}
        />
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
        additionalTypes
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
        manufacturer {
            name
        }
        articleNumbers
        discounts {
            quantity
            price
        }
        availableSince
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

const productRelationsQuery = gql`
    query ProductGridRelations {
        productCategories {
            nodes {
                id
                title
            }
        }
        productTags {
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
