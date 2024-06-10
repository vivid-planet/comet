import { useApolloClient, useQuery } from "@apollo/client";
import {
    CrudContextMenu,
    CrudVisibility,
    filterByFragment,
    GridCellContent,
    GridColDef,
    GridColumnsButton,
    GridFilterButton,
    MainContent,
    messages,
    muiGridFilterToGql,
    muiGridSortToGql,
    StackLink,
    Toolbar,
    ToolbarAutomaticTitleItem,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { Add as AddIcon, Delete, DeleteForever, Edit, MoreVertical, MoveToTrash, Restore, StateFilled } from "@comet/admin-icons";
import { DamImageBlock } from "@comet/cms-admin";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    MenuList,
    Typography,
    useTheme,
} from "@mui/material";
import { DataGridPro, GridColDef, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";

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

interface DeleteDialogProps {
    dialogOpen: boolean;
    onDelete: () => void;
    onCancel: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
    const { dialogOpen, onDelete, onCancel } = props;

    return (
        <Dialog open={dialogOpen} onClose={onCancel}>
            <DialogTitle>
                <FormattedMessage id="products.deleteDialog.title" defaultMessage="Delete item?" />
            </DialogTitle>
            <DialogContent>Lorem Ipsum dolor sit amet</DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    <FormattedMessage {...messages.no} />
                </Button>
                <Button onClick={onDelete} color="primary" variant="contained">
                    <FormattedMessage {...messages.yes} />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

type MoreActionsProps = {
    selectedIds: string[];
    statusFilter: null | "Deleted";
    setStatusFilter: (status: null | "Deleted") => void;
    refetch: () => void;
};
function MoreActions(props: MoreActionsProps) {
    const client = useApolloClient();
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

    const handleMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleDelete = async () => {
        for (const id of props.selectedIds) {
            await client.mutate<GQLUpdateProductStatusMutation, GQLUpdateProductStatusMutationVariables>({
                mutation: updateProductStatusMutation,
                variables: { id, status: "Deleted" },
            });
        }
        await props.refetch();
    };

    const handleRestore = async () => {
        for (const id of props.selectedIds) {
            await client.mutate<GQLUpdateProductStatusMutation, GQLUpdateProductStatusMutationVariables>({
                mutation: updateProductStatusMutation,
                variables: { id, status: "Unpublished" },
            });
        }
        await props.refetch();
    };

    const handleDeletePermanently = async () => {
        for (const id of props.selectedIds) {
            await client.mutate<GQLDeleteProductMutation, GQLDeleteProductMutationVariables>({
                mutation: deleteProductMutation,
                variables: { id },
            });
        }
        await props.refetch();
    };

    return (
        <>
            <Button variant="text" color="inherit" endIcon={<MoreVertical />} sx={{ mx: 2 }} onClick={handleMenuButtonClick}>
                <FormattedMessage id="products.moreActions" defaultMessage="More actions" />
            </Button>
            <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                keepMounted={false}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <Box px={3}>
                    <Typography variant="subtitle2" color={(theme) => theme.palette.grey[500]} fontWeight="bold" mt={5}>
                        <FormattedMessage id="products.overallActions" defaultMessage="Overall actions" />
                    </Typography>
                    <MenuList>
                        {props.statusFilter == null && (
                            <MenuItem
                                onClick={() => {
                                    props.setStatusFilter("Deleted");
                                    handleMenuClose();
                                }}
                            >
                                <ListItemIcon>
                                    <Delete />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="products.openTrash" defaultMessage="Open trash" />} />
                            </MenuItem>
                        )}
                        {props.statusFilter == "Deleted" && (
                            <MenuItem
                                onClick={() => {
                                    props.setStatusFilter(null);
                                    handleMenuClose();
                                }}
                            >
                                <ListItemIcon>
                                    <Delete />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="products.closeTrash" defaultMessage="Close trash" />} />
                            </MenuItem>
                        )}
                    </MenuList>
                </Box>
                <Box px={3}>
                    <Typography variant="subtitle2" color={(theme) => theme.palette.grey[500]} fontWeight="bold" mt={5}>
                        <FormattedMessage id="products.selectiveActions" defaultMessage="Selective actions" />
                    </Typography>
                    <MenuList>
                        {props.statusFilter == null && (
                            <MenuItem
                                disabled={props.selectedIds.length == 0}
                                onClick={() => {
                                    setDeleteDialogOpen(true);
                                    handleMenuClose();
                                }}
                            >
                                <ListItemIcon>
                                    <MoveToTrash />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="products.delete" defaultMessage="Delete" />} />
                            </MenuItem>
                        )}
                        {props.statusFilter == "Deleted" && (
                            <MenuItem
                                disabled={props.selectedIds.length == 0}
                                onClick={async () => {
                                    await handleRestore();
                                    handleMenuClose();
                                }}
                            >
                                <ListItemIcon>
                                    <Restore /> {/* wrong icon, RestoreFromTrash doesn't exist yet */}
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="products.restore" defaultMessage="Restore" />} />
                            </MenuItem>
                        )}
                        {props.statusFilter == "Deleted" && (
                            <MenuItem
                                disabled={props.selectedIds.length == 0}
                                onClick={async () => {
                                    await handleDeletePermanently();
                                    handleMenuClose();
                                }}
                            >
                                <ListItemIcon>
                                    <DeleteForever />
                                </ListItemIcon>
                                <ListItemText primary={<FormattedMessage id="products.deletePermanently" defaultMessage="Delete permanently" />} />
                            </MenuItem>
                        )}
                    </MenuList>
                </Box>
            </Menu>
            <DeleteDialog
                dialogOpen={deleteDialogOpen}
                onDelete={async () => {
                    await handleDelete();
                    setDeleteDialogOpen(false);
                }}
                onCancel={() => {
                    setDeleteDialogOpen(false);
                }}
            />
        </>
    );
}

type ProductsGridToolbarProps = {
    selectedIds: string[];
    statusFilter: null | "Deleted";
    setStatusFilter: (status: null | "Deleted") => void;
    refetch: () => void;
};
function ProductsGridToolbar(props: ProductsGridToolbarProps) {
    return (
        <Toolbar>
            <ToolbarAutomaticTitleItem />
            {props.statusFilter == "Deleted" && (
                <ToolbarItem>
                    <Chip variant="outlined" icon={<Delete />} label=<FormattedMessage id="products.trash" defaultMessage="Trash" /> />
                </ToolbarItem>
            )}
            <ToolbarItem>
                <GridToolbarQuickFilter />
            </ToolbarItem>
            <ToolbarFillSpace />
            <ToolbarItem>
                <GridFilterButton />
            </ToolbarItem>
            <ToolbarItem>
                <GridColumnsButton />
            </ToolbarItem>
            <ToolbarItem>
                <MoreActions
                    selectedIds={props.selectedIds}
                    statusFilter={props.statusFilter}
                    setStatusFilter={props.setStatusFilter}
                    refetch={props.refetch}
                />
                {props.statusFilter == null && (
                    <Button startIcon={<AddIcon />} component={StackLink} pageName="add" payload="add" variant="contained" color="primary">
                        <FormattedMessage id="products.newProduct" defaultMessage="New Product" />
                    </Button>
                )}
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
    const intl = useIntl();
    const theme = useTheme();
    const [rowSelectionModel, setRowSelectionModel] = React.useState<string[]>([]);
    const [statusFilter, setStatusFilter] = React.useState<null | "Deleted">(null);

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
            field: "category",
            headerName: "Category",
            flex: 1,
            minWidth: 100,
            renderCell: (params) => <>{params.row.category?.title}</>,
            type: "singleSelect",
            visible: theme.breakpoints.up("md"),
            valueOptions: categoriesData?.productCategories.nodes.map((i) => ({ value: i.id, label: i.title })),
        },
        {
            field: "tags",
            headerName: "Tags",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.row.tags.map((tag) => tag.title).join(", ")}</>,
        },
        {
            field: "inStock",
            headerName: "In Stock",
            flex: 1,
            minWidth: 80,
            visible: theme.breakpoints.up("md"),
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
        { field: "inStock", headerName: "In Stock", width: 50, type: "boolean" },
    ];
    if (statusFilter == null) {
        columns.push({
            field: "status",
            headerName: "Status",
            flex: 1,
            minWidth: 130,
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
        });
        columns.push({
            field: "action",
            headerName: "",
            sortable: false,
            filterable: false,
            width: 106,
            renderCell: (params) => {
                return (
                    <>
                        <ProductsGridPreviewAction product={params.row} />
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
                                // TODO dialog shows "WARNING: This cannot be undone!" which is not true
                                await client.mutate<GQLUpdateProductStatusMutation, GQLUpdateProductStatusMutationVariables>({
                                    mutation: updateProductStatusMutation,
                                    variables: { id: params.row.id, status: "Deleted" },
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
        });
    } else if (statusFilter == "Deleted") {
        columns.push({
            field: "action",
            headerName: "",
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton
                            onClick={async () => {
                                await client.mutate<GQLDeleteProductMutation, GQLDeleteProductMutationVariables>({
                                    mutation: deleteProductMutation,
                                    variables: { id: params.row.id },
                                });
                                refetch();
                            }}
                        >
                            <DeleteForever />
                        </IconButton>
                        <IconButton
                            onClick={async () => {
                                await client.mutate<GQLUpdateProductStatusMutation, GQLUpdateProductStatusMutationVariables>({
                                    mutation: updateProductStatusMutation,
                                    variables: { id: params.row.id, status: "Unpublished" },
                                });
                                refetch();
                            }}
                        >
                            <Restore /> {/* wrong icon, RestoreFromTrash doesn't exist yet */}
                        </IconButton>
                    </>
                );
            },
        });
    }

    const { data, loading, error, refetch } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            ...muiGridFilterToGql(columns, dataGridProps.filterModel),
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel, dataGridProps.apiRef),
            status: statusFilter ? statusFilter : ["Published", "Unpublished"],
        },
    });
    const rows = data?.products.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.products.totalCount);

    return (
        <MainContent fullHeight disablePadding>
            <DataGridPro
                {...dataGridProps}
                rows={rows}
                rowCount={rowCount}
                columns={columns}
                loading={loading}
                error={error}
                checkboxSelection={true}
                onSelectionModelChange={(newRowSelectionModel) => {
                    setRowSelectionModel(newRowSelectionModel as string[]);
                }}
                selectionModel={rowSelectionModel}
                components={{
                    Toolbar: ProductsGridToolbar,
                }}
                componentsProps={{
                    toolbar: { selectedIds: rowSelectionModel, statusFilter, setStatusFilter, refetch },
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
    query ProductsList($offset: Int, $limit: Int, $sort: [ProductSort!], $filter: ProductFilter, $search: String, $status: [ProductStatus!]) {
        products(offset: $offset, limit: $limit, sort: $sort, filter: $filter, search: $search, status: $status) {
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

const deleteProductMutation = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id)
    }
`;
