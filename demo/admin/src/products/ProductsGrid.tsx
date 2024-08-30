import { useApolloClient, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    CrudVisibility,
    DataGridToolbar,
    ExportApi,
    filterByFragment,
    GridCellContent,
    GridColDef,
    GridColumnsButton,
    GridFilterButton,
    MainContent,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridExcelExport,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Edit, Excel, MoreVertical, StateFilled } from "@comet/admin-icons";
import { DamImageBlock } from "@comet/cms-admin";
import { Button, CircularProgress, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
import { DataGridPro, GridFilterInputSingleSelect, GridFilterInputValue, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";

import {
    GQLCreateProductMutation,
    GQLCreateProductMutationVariables,
    GQLDeleteProductMutation,
    GQLDeleteProductMutationVariables,
    GQLProductGridRelationsQuery,
    GQLProductGridRelationsQueryVariables,
    GQLProductsListManualFragment,
    GQLProductsListQuery,
    GQLProductsListQueryVariables,
    GQLUpdateProductStatusMutation,
    GQLUpdateProductStatusMutationVariables,
} from "./ProductsGrid.generated";
import { ProductsGridPreviewAction } from "./ProductsGridPreviewAction";

function ProductsGridToolbar({ exportApi }: { exportApi: ExportApi }) {
    const [showMoreMenu, setShowMoreMenu] = React.useState<boolean>(false);
    const moreMenuRef = React.useRef<HTMLButtonElement>(null);

    return (
        <DataGridToolbar>
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarItem>
                <GridColumnsButton />
            </ToolbarItem>
            <ToolbarItem>
                <Button
                    variant="text"
                    ref={moreMenuRef}
                    onClick={() => {
                        setShowMoreMenu(true);
                    }}
                    endIcon={<MoreVertical />}
                >
                    <FormattedMessage id="products.moreActions" defaultMessage="More actions" />
                </Button>
                <Menu
                    open={showMoreMenu}
                    onClose={() => setShowMoreMenu(false)}
                    anchorEl={moreMenuRef.current}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                >
                    <MenuItem onClick={() => exportApi.exportGrid()} disabled={exportApi.loading}>
                        {exportApi.loading ? <CircularProgress size={20} sx={{ marginRight: "10px" }} /> : <Excel sx={{ marginRight: "10px" }} />}
                        <FormattedMessage id="products.downloadAsExcel" defaultMessage="Download as Excel" />
                    </MenuItem>
                </Menu>
            </ToolbarItem>
            <ToolbarItem>
                <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                    <FormattedMessage id="products.newProduct" defaultMessage="New Product" />
                </Button>
            </ToolbarItem>
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

    const columns: GridColDef<GQLProductsListManualFragment>[] = [
        {
            field: "overview",
            headerName: "Overview",
            minWidth: 200,
            flex: 1,
            sortBy: ["title", "price", "type", "category", "inStock"],
            visible: theme.breakpoints.down("md"),
            disableExport: true,
            renderCell: ({ row }) => {
                const secondaryValues = [
                    typeof row.price === "number" && intl.formatNumber(row.price, { style: "currency", currency: "EUR" }),
                    row.type,
                    row.category?.title,
                    row.inStock
                        ? intl.formatMessage({ id: "comet.products.product.inStock", defaultMessage: "In Stock" })
                        : intl.formatMessage({ id: "comet.products.product.outOfStock", defaultMessage: "Out of Stock" }),
                ];
                return <GridCellContent primaryText={row.title} secondaryText={secondaryValues.filter(Boolean).join(" • ")} />;
            },
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
            valueFormatter: ({ value }) => intl.formatNumber(value, { style: "currency", currency: "EUR" }), // excel-column should be configured as currency-type alternatively prop below
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
            valueFormatter: ({ value }) => value.join(", "),
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
        },
        {
            field: "category",
            headerName: "Category",
            flex: 1,
            minWidth: 100,
            valueGetter: ({ value, row }) => value?.title ?? "",
            renderCell: (params) => <>{params.row.category?.title}</>,
            type: "singleSelect",
            visible: theme.breakpoints.up("md"),
            valueOptions: relationsData?.productCategories.nodes.map((i) => ({ value: i.id, label: i.title })),
        },
        {
            field: "tags",
            headerName: "Tags",
            flex: 1,
            minWidth: 150,
            valueFormatter: ({ value }) => value.join(", "),
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
        },
        {
            field: "inStock",
            headerName: "In Stock",
            flex: 1,
            minWidth: 80,
            visible: theme.breakpoints.up("md"),
            valueFormatter: (
                { value }, // should probably be a boolean-column
            ) =>
                value
                    ? intl.formatMessage({ id: "products.inStock", defaultMessage: "In Stock" })
                    : intl.formatMessage({ id: "products.outOfStock", defaultMessage: "Out of Stock" }),
            renderCell: (params) => (
                <GridCellContent
                    icon={<StateFilled color={params.row.inStock ? "success" : "error"} />}
                    primaryText={
                        params.row.inStock ? (
                            <FormattedMessage id="products.inStock" defaultMessage="In Stock" />
                        ) : (
                            <FormattedMessage id="products.outOfStock" defaultMessage="Out of Stock" />
                        )
                    }
                />
            ),
        },
        {
            field: "availableSince",
            headerName: "Available Since",
            width: 130,
            type: "date",
            disableExport: true, // date-value is not allowed for export, no way to provide a different value for excel-export
            valueGetter: ({ row }) => row.availableSince && new Date(row.availableSince),
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            minWidth: 130,
            type: "boolean",
            disableExport: true, // boolean-value is not allowed for export, no way to provide a different value for excel-export
            valueGetter: (params) => params.row.status == "Published", // why is this here?
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
            field: "action",
            headerName: "",
            sortable: false,
            filterable: false,
            width: 106,
            disableExport: true, // action-columns not needed in excel
            pinned: "right",
            renderCell: (params) => {
                return (
                    <>
                        <ProductsGridPreviewAction {...params} />
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
        },
    ];

    const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel, dataGridProps.apiRef),
        },
    });
    const rows = data?.products.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.products.totalCount);

    const exportApi = useDataGridExcelExport<GQLProductsListQuery["products"]["nodes"][0], GQLProductsListQuery, GQLProductsListQueryVariables>({
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
        <MainContent fullHeight>
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
                componentsProps={{
                    toolbar: { exportApi: exportApi },
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
