import { useQuery } from "@apollo/client";
import { DataGridPro, GridColDef, GridFilterModel, GridToolbar } from "@mui/x-data-grid-pro";
import { GQLProductsListQuery, GQLProductsListQueryVariables } from "@src/graphql.generated";
import gql from "graphql-tag";
import * as React from "react";

const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "price", headerName: "Price", width: 150, type: "number" },
];

const productsQuery = gql`
    query ProductsList($filter: ProductFilter, $query: String) {
        products(filter: $filter, query: $query) {
            nodes {
                id
                name
                description
                price
            }
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

function Products() {
    const [filterModel, setFilterModel] = React.useState<GridFilterModel | undefined>();

    const { filter, query } = muiGridFilterToGql(filterModel);

    const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            filter,
            query,
        },
    });
    const rows = data?.products.nodes ?? [];

    const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
        setFilterModel(filterModel);
    }, []);

    if (error) {
        return <>ERROR: {JSON.stringify(error)}</>;
    }

    return (
        <div style={{ height: 300, width: "100%" }}>
            <DataGridPro
                rows={rows}
                columns={columns}
                filterMode="server"
                onFilterModelChange={onFilterChange}
                loading={loading}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
            />
            <p>filterModel: {JSON.stringify(filterModel)}</p>
            <p>filter: {JSON.stringify(filter)}</p>
            <p>query: {JSON.stringify(query)}</p>
        </div>
    );
}

export default Products;
