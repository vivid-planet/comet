import { useQuery } from "@apollo/client";
import { DataGridPro, GridColDef, GridFilterModel, GridLinkOperator, GridToolbar } from "@mui/x-data-grid-pro";
import { GQLProductsListQuery, GQLProductsListQueryVariables } from "@src/graphql.generated";
import gql from "graphql-tag";
import * as React from "react";

const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "price", headerName: "Price", width: 150, type: "number" },
];

const productsQuery = gql`
    query ProductsList($filters: ProductFilterItems, $query: String) {
        products(filters: $filters, query: $query) {
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
type GqlFilterOperation =
    | "Contains"
    | "StartsWith"
    | "EndsWith"
    | "IsEqual"
    | "LessThan"
    | "GreaterThan"
    | "LessOrEqual"
    | "GreaterOrEqual"
    | "NotEqual"
    | "IsAnyOf"
    | "IsEmpty"
    | "NotEmpty";
const muiGridOperatorValueToGqlOperator: { [key: string]: GqlFilterOperation } = {
    contains: "Contains",
    equals: "IsEqual",
    ">": "GreaterThan",
    ">=": "GreaterOrEqual",
    "<": "LessThan",
    "<=": "LessOrEqual",
    "=": "IsEqual",
    "!=": "NotEqual",
    startsWith: "StartsWith",
    endsWith: "EndsWith",
    isAnyOf: "IsAnyOf",
    isEmpty: "IsEmpty",
    isNotEmpty: "NotEmpty",
    is: "IsEqual",
    not: "NotEqual",
    after: "GreaterThan",
    onOrAfter: "GreaterOrEqual",
    before: "LessThan",
    onOrBefore: "LessOrEqual",
};

interface GqlFilterItem {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    field: any; //TODO Enum in app, how to type in library
    value: string;
    operation: GqlFilterOperation;
}

type GqlFilter = {
    filterItems: GqlFilterItem[];
    filterItemsOperator: "And" | "Or";
};
function muiGridFilterToGql(filterModel?: GridFilterModel): { filters?: GqlFilter; query?: string } {
    if (!filterModel) return {};
    const filters: GqlFilter = {
        filterItems: filterModel.items
            .filter((value) => value.value !== undefined)
            .map((value) => {
                if (!value.operatorValue) throw new Error("operaturValue not set");
                const gqlOperator = muiGridOperatorValueToGqlOperator[value.operatorValue];
                if (!gqlOperator) throw new Error(`unknown operator ${value.operatorValue}`);

                return {
                    value: value.value,
                    field: value.columnField,
                    operation: gqlOperator,
                };
            }),
        filterItemsOperator: filterModel.linkOperator == GridLinkOperator.And ? "And" : "Or", //defaults to Or
    };

    let query: undefined | string = undefined;

    if (filterModel.quickFilterValues) {
        query = filterModel.quickFilterValues.join(" ");
    }

    return { filters, query };
}
// END TODO move into library

const fieldToFilterField: { [key: string]: string } = {
    name: "Name",
    description: "Description",
    price: "Price",
};

function Products() {
    const [filterModel, setFilterModel] = React.useState<GridFilterModel | undefined>();

    // eslint-disable-next-line prefer-const
    let { filters, query } = muiGridFilterToGql(filterModel);

    //TODO find a solution how to convert field names to FilterFieldNames enum
    if (filters) {
        filters = {
            ...filters,
            filterItems: filters.filterItems.map((value) => {
                return {
                    ...value,
                    field: fieldToFilterField[value.field],
                };
            }),
        };
    }

    const { data, loading, error } = useQuery<GQLProductsListQuery, GQLProductsListQueryVariables>(productsQuery, {
        variables: {
            filters,
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
            <p>filters: {JSON.stringify(filters)}</p>
            <p>query: {JSON.stringify(query)}</p>
        </div>
    );
}

export default Products;
