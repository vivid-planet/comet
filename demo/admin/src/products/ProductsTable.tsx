import { ApolloClient, RefetchQueriesOptions, useApolloClient, useQuery } from "@apollo/client";
import { StackLink, Toolbar, ToolbarAutomaticTitleItem, ToolbarFillSpace, ToolbarItem, useErrorDialog, useStoredState } from "@comet/admin";
import { Add as AddIcon, Copy, Delete as DeleteIcon, Domain, Edit, Filter, MoreVertical, Paste, ThreeDotSaving } from "@comet/admin-icons";
import { readClipboard, writeClipboard } from "@comet/blocks-admin";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import {
    DataGridPro,
    DataGridProProps,
    GridColDef,
    GridColumnVisibilityModel,
    GridFilterModel,
    GridSortDirection,
    GridSortModel,
    GridToolbar,
    GridToolbarQuickFilter,
    useGridApiContext,
    useGridApiRef,
} from "@mui/x-data-grid-pro";
import { GQLProductsListQuery, GQLProductsListQueryVariables } from "@src/graphql.generated";
import gql from "graphql-tag";
import queryString from "query-string";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, useLocation } from "react-router";

// BEGIN TODO move into library
export interface StructuredDataTableDeleteDialogProps {
    dialogOpen: boolean;
    handleNoClick: () => void;
    handleYesClick: () => void;
}

export const StructuredDataTableDeleteDialog: React.FC<StructuredDataTableDeleteDialogProps> = (props) => {
    const { dialogOpen, handleNoClick, handleYesClick } = props;

    return (
        <Dialog open={dialogOpen} onClose={handleNoClick}>
            <DialogTitle>
                <FormattedMessage id="comet.table.deleteDialog.title" defaultMessage="Delete item?" />
            </DialogTitle>
            <DialogContent>
                <FormattedMessage id="comet.table.deleteDialog.content" defaultMessage="WARNING: This cannot be undone!" />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleYesClick} color="primary" variant="contained">
                    <FormattedMessage id="comet.generic.yes" defaultMessage="Yes" />
                </Button>
                <Button onClick={handleNoClick} color="primary">
                    <FormattedMessage id="comet.generic.no" defaultMessage="No" />
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface StructuredDataTableContextMenuProps {
    url?: string;
    onPaste?: (options: { input: unknown; client: ApolloClient<object> }) => Promise<void>;
    onDelete?: (options: { id: unknown; client: ApolloClient<object> }) => Promise<void>;
    id: string | number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetchQueries: RefetchQueriesOptions<any, unknown>;
    copyData?: unknown;
}

function StructuredDataTableContextMenu({
    url,
    id,
    onPaste,
    onDelete,
    refetchQueries,
    copyData,
}: StructuredDataTableContextMenuProps): React.ReactElement {
    const intl = useIntl();
    const client = useApolloClient();
    const errorDialog = useErrorDialog();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [copyLoading, setCopyLoading] = React.useState(false);
    const [pasting, setPasting] = React.useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = async () => {
        if (!onDelete) return;
        await onDelete({
            id,
            client,
        });
        await client.refetchQueries(refetchQueries);
        setDeleteDialogOpen(false);
    };

    const handlePasteClick = async () => {
        if (!onPaste) return;
        const clipboard = await readClipboard();

        if (clipboard) {
            let input;

            try {
                input = JSON.parse(clipboard);
            } catch (e) {
                errorDialog?.showError({
                    userMessage: <FormattedMessage id="comet.common.clipboardInvalidFormat" defaultMessage="Clipboard contains an invalid format" />,
                    error: e.toString(),
                });
                console.error("Bad clidpboard value, parsing JSON failed", e);
            }

            if (input) {
                // TODO validate input?
                try {
                    await onPaste({
                        input,
                        client,
                    });
                    await client.refetchQueries(refetchQueries);
                } catch (e) {
                    errorDialog?.showError({
                        userMessage: (
                            <FormattedMessage
                                id="comet.common.pasteFailedInvalidFormat"
                                defaultMessage="Paste failed, probably due to an invalid format"
                            />
                        ),
                        error: e.toString(),
                    });
                    console.error("mutation failed", e);
                }
            }
        } else {
            console.error("Clidpboard is empty");
        }
    };

    const handleCopyClick = async () => {
        await writeClipboard(JSON.stringify(copyData));
    };

    return (
        <>
            <IconButton onClick={handleClick} size="large">
                <MoreVertical />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {url && (
                    <MenuItem
                        key="copyUrl"
                        onClick={() => {
                            handleClose();
                            writeClipboard(url);
                        }}
                    >
                        <ListItemIcon>
                            <Domain />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.generic.copyUrl", defaultMessage: "Copy Url" })} />
                    </MenuItem>
                )}
                {copyData && (
                    <MenuItem
                        onClick={async () => {
                            setCopyLoading(true);
                            await handleCopyClick();
                            setCopyLoading(false);
                            handleClose();
                        }}
                    >
                        <ListItemIcon>{!copyLoading ? <Copy /> : <ThreeDotSaving />}</ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.generic.copy", defaultMessage: "Copy" })} />
                    </MenuItem>
                )}
                {onPaste && (
                    <MenuItem
                        key="paste"
                        onClick={async () => {
                            setPasting(true);
                            await handlePasteClick();
                            setPasting(false);
                            handleClose();
                        }}
                    >
                        <ListItemIcon>{!pasting ? <Paste /> : <ThreeDotSaving />}</ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.generic.paste", defaultMessage: "Paste" })} />
                    </MenuItem>
                )}
                {onDelete && (
                    <MenuItem
                        onClick={() => {
                            handleClose();
                            setDeleteDialogOpen(true);
                        }}
                    >
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText primary={intl.formatMessage({ id: "comet.generic.deleteItem", defaultMessage: "Delete item" })} />
                    </MenuItem>
                )}
            </Menu>
            <StructuredDataTableDeleteDialog
                dialogOpen={deleteDialogOpen}
                handleNoClick={() => {
                    setDeleteDialogOpen(false);
                }}
                handleYesClick={handleDeleteClick}
            />
        </>
    );
}

const muiGridOperatorValueToGqlOperator: { [key: string]: string } = {
    contains: "contains",
    equals: "equal",
    ">": "greaterThan",
    ">=": "greaterThanEqual",
    "<": "lowerThan",
    "<=": "lowerThanEqual",
    "=": "equal",
    "!=": "notEqual",
    startsWith: "startsWith",
    endsWith: "endsWith",
    isAnyOf: "isAnyOf",
    isEmpty: "isEmpty",
    isNotEmpty: "isNotEmpty",
    is: "equal",
    not: "notEqual",
    after: "greaterThan",
    onOrAfter: "greaterThanEqual",
    before: "lowerThan",
    onOrBefore: "lowerThanEqual",
};

interface GqlStringFilter {
    contains?: string | null;
    startsWith?: string | null;
    endsWith?: string | null;
    equal?: string | null;
    notEqual?: string | null;
}
interface GqlNumberFilter {
    equal?: number | null;
    lowerThan?: number | null;
    greaterThan?: number | null;
    lowerThanEqual?: number | null;
    greaterThanEqual?: number | null;
    notEqual?: number | null;
}
type GqlFilter = {
    [key: string]: GqlStringFilter | GqlNumberFilter; //TODO add Boolean, Date, DateTime(?), SingleSelect(??)
} & {
    and?: GqlFilter[] | null;
    or?: GqlFilter[] | null;
};
function muiGridFilterToGql(columns: GridColDef[], filterModel?: GridFilterModel): { filter: GqlFilter; query?: string } {
    if (!filterModel) return { filter: {} };
    const filterItems = filterModel.items
        .filter((value) => value.value !== undefined)
        .map((value) => {
            if (!value.operatorValue) throw new Error("operaturValue not set");
            const gqlOperator = muiGridOperatorValueToGqlOperator[value.operatorValue];
            if (!gqlOperator) throw new Error(`unknown operator ${value.operatorValue}`);
            const column = columns.find((i) => i.field == value.columnField);
            const type = column?.type;
            const convertedValue = type === "number" ? parseFloat(value.value) : value.value;
            return {
                [value.columnField]: {
                    [gqlOperator]: convertedValue,
                } as GqlStringFilter | GqlNumberFilter,
            };
        });
    const filter: GqlFilter = {};
    const op: "and" | "or" = filterModel.linkOperator ?? "or";
    filter[op] = filterItems;

    let query: undefined | string = undefined;

    if (filterModel.quickFilterValues) {
        query = filterModel.quickFilterValues.join(" ");
    }

    return { filter, query };
}

//returns props for DataGrid that turns it into a controlled component ready to be used for remote filter/sorting/paging
function useDataGridRemote({
    queryParamsPrefix = "",
}: {
    queryParamsPrefix?: string;
} = {}): Omit<DataGridProProps, "rows" | "columns"> & { page: number; pageSize: number } {
    const history = useHistory();
    const location = useLocation();

    const sortParamName = `${queryParamsPrefix}sort`;
    const filterParamName = `${queryParamsPrefix}filter`;
    const pageParamName = `${queryParamsPrefix}page`;
    const pageSizeParamName = `${queryParamsPrefix}pageSize`;

    const parsedSearch = queryString.parse(location.search, { parseNumbers: true });
    // TODO configurable search prefix (to support multiple grid on one page)

    const page = (parsedSearch[pageParamName] as number) ?? 0;
    const handlePageChange = (newPage: number) => {
        history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [pageParamName]: newPage }) });
    };

    const pageSize = (parsedSearch[pageSizeParamName] as number) ?? 20;
    const handlePageSizeChange = (newPageSize: number) => {
        history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [pageSizeParamName]: newPageSize }) });
    };

    const sortModel = (
        !parsedSearch.sort
            ? []
            : !Array.isArray(parsedSearch[sortParamName])
            ? [parsedSearch[sortParamName] as string]
            : (parsedSearch[sortParamName] as string[])
    ).map((i) => {
        const parts = i.split(":");
        return {
            field: parts[0],
            sort: parts[1] as GridSortDirection,
        };
    });
    const handleSortModelChange = React.useCallback(
        (sortModel: GridSortModel) => {
            const sort = sortModel.map((i) => `${i.field}:${i.sort}`);
            history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [sortParamName]: sort }) });
        },
        [history, location, parsedSearch, sortParamName],
    );

    const filterModel = parsedSearch.filter ? JSON.parse(parsedSearch[filterParamName] as string) : { items: [] };
    const handleFilterChange = React.useCallback(
        (filterModel: GridFilterModel) => {
            history.replace({ ...location, search: queryString.stringify({ ...parsedSearch, [filterParamName]: JSON.stringify(filterModel) }) });
        },
        [history, location, parsedSearch, filterParamName],
    );

    return {
        filterMode: "server",
        filterModel: filterModel,
        onFilterModelChange: handleFilterChange,

        paginationMode: "server",
        page,
        pageSize,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,

        sortingMode: "server",
        sortModel,
        onSortModelChange: handleSortModelChange,

        components: { Toolbar: GridToolbar },
        componentsProps: {
            toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
            },
        },
        pagination: true,
    };
}

function usePersistentColumnState(stateKey: string): Omit<DataGridProProps, "rows" | "columns"> {
    const apiRef = useGridApiRef();

    const [columnVisibilityModel, setColumnVisibilityModel] = useStoredState<GridColumnVisibilityModel>(`${stateKey}ColumnVisibility`, {});
    const handleColumnVisibilityModelChange = React.useCallback(
        (newModel: GridColumnVisibilityModel) => {
            setColumnVisibilityModel(newModel);
        },
        [setColumnVisibilityModel],
    );

    const [pinnedColumns, setPinnedColumns] = useStoredState<GridColumnVisibilityModel>(`${stateKey}PinnedColumns`, {});
    const handlePinnedColumnsChange = React.useCallback(
        (newModel: GridColumnVisibilityModel) => {
            setPinnedColumns(newModel);
        },
        [setPinnedColumns],
    );

    //no API for column dimensions as controlled state, export on change instead
    const columnDimensionsKey = `${stateKey}ColumnDimensions`;
    const initialColumnDimensions = React.useMemo(() => {
        const serializedState = window.localStorage.getItem(columnDimensionsKey);
        return serializedState ? JSON.parse(serializedState) : undefined;
    }, [columnDimensionsKey]);

    const handleColumnWidthChange = React.useCallback(() => {
        const newState = apiRef.current.exportState().columns?.dimensions ?? {};
        window.localStorage.setItem(columnDimensionsKey, JSON.stringify(newState));
    }, [columnDimensionsKey, apiRef]);

    //no API for column order as controlled state, export on change instead
    const columnOrderKey = `${stateKey}ColumnOrder`;
    const initialColumnOrder = React.useMemo(() => {
        const serializedState = window.localStorage.getItem(columnOrderKey);
        return serializedState ? JSON.parse(serializedState) : undefined;
    }, [columnOrderKey]);
    const handleColumnOrderChange = React.useCallback(() => {
        const newState = apiRef.current.exportState().columns?.orderedFields ?? undefined;
        window.localStorage.setItem(columnOrderKey, JSON.stringify(newState));
    }, [columnOrderKey, apiRef]);

    const initialState = {
        columns: {
            dimensions: initialColumnDimensions,
            orderedFields: initialColumnOrder,
        },
    };

    return {
        columnVisibilityModel,
        onColumnVisibilityModelChange: handleColumnVisibilityModelChange,

        pinnedColumns,
        onPinnedColumnsChange: handlePinnedColumnsChange,

        onColumnWidthChange: handleColumnWidthChange,

        onColumnOrderChange: handleColumnOrderChange,

        apiRef,
        initialState,
    };
}

function useBufferedRowCount(rowCount: number | undefined) {
    // Some API clients return undefined while loading
    // Following lines are here to prevent `rowCountState` from being undefined during the loading
    const [rowCountState, setRowCountState] = React.useState(0);

    React.useEffect(() => {
        setRowCountState((prevRowCountState) => (rowCount !== undefined ? rowCount : prevRowCountState));
    }, [rowCount, setRowCountState]);

    return rowCountState;
}

function GridFilterButton() {
    const apiRef = useGridApiContext();
    const handleFilterClick = React.useCallback(() => {
        apiRef.current.showFilterPanel();
    }, [apiRef]);
    return (
        <Button startIcon={<Filter />} variant="text" color="info" onClick={handleFilterClick}>
            <FormattedMessage id="comet.core.filter" defaultMessage="Filter" />
        </Button>
    );
}
// END TODO move into library

function ProductsTableToolbar() {
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
                    <FormattedMessage id="cometDemo.products.newProduct" defaultMessage="New Product" />
                </Button>
            </ToolbarItem>
        </Toolbar>
    );
}

const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "price", headerName: "Price", width: 150, type: "number" },
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
                    <StructuredDataTableContextMenu
                        onPaste={async ({ input, client }) => {
                            await client.mutate({
                                mutation: createProductMutation,
                                variables: { input },
                            });
                        }}
                        onDelete={async ({ id, client }) => {
                            await client.mutate({
                                mutation: deleteProductMutation,
                                variables: { id },
                            });
                        }}
                        // url={url}
                        id={params.id}
                        refetchQueries={["ProductsList"]}
                        copyData={{
                            name: params.row.name,
                            description: params.row.description,
                            price: params.row.price,
                        }}
                    />
                </>
            );
        },
    },
];
function ProductsTable() {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };
    const sortModel = dataGridProps.sortModel;

    const { filter, query } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            filter,
            query,
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sortColumnName: sortModel && sortModel.length > 0 ? sortModel[0].field : undefined,
            sortDirection: sortModel && sortModel.length > 0 ? (sortModel[0].sort == "desc" ? "DESC" : "ASC") : undefined,
        },
    });
    const rows = data?.products.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.products.totalCount);

    if (error) {
        return (
            <Alert severity="error">
                <FormattedMessage id="comet.error.abstractErrorMessage" defaultMessage="An error has occurred" />
            </Alert>
        );
        //return <>ERROR: {JSON.stringify(error)}</>;
    }

    return (
        <div>
            <div style={{ height: 600, width: "100%" /* TODO use full height (DataGrid fullHeight will make paging scroll down) */ }}>
                <DataGridPro
                    {...dataGridProps}
                    disableSelectionOnClick
                    rows={rows}
                    rowCount={rowCount}
                    columns={columns}
                    loading={loading}
                    components={{
                        Toolbar: ProductsTableToolbar,
                    }}
                />
            </div>
        </div>
    );
}

const productsQuery = gql`
    query ProductsList($offset: Int, $limit: Int, $sortColumnName: String, $sortDirection: SortDirection, $filter: ProductFilter, $query: String) {
        products(offset: $offset, limit: $limit, sortColumnName: $sortColumnName, sortDirection: $sortDirection, filter: $filter, query: $query) {
            nodes {
                id
                name
                description
                price
            }
            totalCount
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
        addProduct(data: $input) {
            id
        }
    }
`;

export default ProductsTable;
