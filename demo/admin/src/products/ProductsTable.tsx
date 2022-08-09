import { useQuery } from "@apollo/client";
import { DataGridPro, DataGridProProps, GridColDef, GridFilterModel, GridSortModel, GridToolbar } from "@mui/x-data-grid-pro";
import { GQLProductsListQuery, GQLProductsListQueryVariables } from "@src/graphql.generated";
import gql from "graphql-tag";
import * as React from "react";

const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "price", headerName: "Price", width: 150, type: "number" },
];

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

// BEGIN TODO move into library
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
    geraterThan?: number | null;
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
function muiGridFilterToGql(filterModel?: GridFilterModel): { filter: GqlFilter; query?: string } {
    if (!filterModel) return { filter: {} };
    const filterItems = filterModel.items
        .filter((value) => value.value !== undefined)
        .map((value) => {
            if (!value.operatorValue) throw new Error("operaturValue not set");
            const gqlOperator = muiGridOperatorValueToGqlOperator[value.operatorValue];
            if (!gqlOperator) throw new Error(`unknown operator ${value.operatorValue}`);
            return {
                [value.columnField]: {
                    [gqlOperator]: value.value,
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
// END TODO move into library

//returns props for DataGrid that turns it into a controlled component ready to be used for remote filter/sorting/paging
function useDataGridRemote(): Omit<DataGridProProps, "rows" | "columns"> & { page: number; pageSize: number } {
    const [filterModel, setFilterModel] = React.useState<GridFilterModel>({ items: [] });
    const [page, setPage] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(20);
    const [sortModel, setSortModel] = React.useState<GridSortModel>([]);

    const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
        setFilterModel(filterModel);
    }, []);

    const handleSortModelChange = React.useCallback((sortModel: GridSortModel) => {
        setSortModel(sortModel);
    }, []);

    return {
        filterMode: "server",
        filterModel: filterModel,
        onFilterModelChange: onFilterChange,
        paginationMode: "server",
        page,
        pageSize,
        onPageChange: (newPage: number) => {
            setPage(newPage);
        },
        onPageSizeChange: (newPageSize: number) => setPageSize(newPageSize),
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

function useBufferedRowCount(rowCount: number | undefined) {
    // Some API clients return undefined while loading
    // Following lines are here to prevent `rowCountState` from being undefined during the loading
    const [rowCountState, setRowCountState] = React.useState(0);

    React.useEffect(() => {
        setRowCountState((prevRowCountState) => (rowCount !== undefined ? rowCount : prevRowCountState));
    }, [rowCount, setRowCountState]);

    return rowCountState;
}

function ProductsTable() {
    const dataGridProps = useDataGridRemote();
    const sortModel = dataGridProps.sortModel;

    const { filter, query } = muiGridFilterToGql(dataGridProps.filterModel);

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
        return <>ERROR: {JSON.stringify(error)}</>;
    }

    return (
        <div style={{ height: 300, width: "100%" }}>
            <DataGridPro {...dataGridProps} rows={rows} rowCount={rowCount} columns={columns} loading={loading} />
        </div>
    );
}

export default ProductsTable;
