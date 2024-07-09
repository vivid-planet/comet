import { useQuery } from "@apollo/client";
import {
    DataGridToolbar,
    GridCellContent,
    GridColDef,
    GridColumnsButton,
    GridFilterButton,
    muiGridFilterToGql,
    muiGridSortToGql,
    ToolbarFillSpace,
    ToolbarItem,
    useBufferedRowCount,
    useDataGridRemote,
    usePersistentColumnState,
} from "@comet/admin";
import { useTheme } from "@mui/material";
import { DataGridPro, GridFilterInputSingleSelect, GridToolbarQuickFilter } from "@mui/x-data-grid-pro";
import gql from "graphql-tag";
import * as React from "react";
import { FormattedNumber, useIntl } from "react-intl";

import {
    GQLProductsSelectGridItemFragment,
    GQLProductsSelectGridListQuery,
    GQLProductsSelectGridListQueryVariables,
    GQLProductsSelectGridRelationsQuery,
    GQLProductsSelectGridRelationsQueryVariables,
} from "./ProductsSelectGrid.generated";

function ProductsGridToolbar() {
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
        </DataGridToolbar>
    );
}

export function ProductsSelectGrid({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
    const dataGridProps = { ...useDataGridRemote(), ...usePersistentColumnState("ProductsGrid") };
    const sortModel = dataGridProps.sortModel;
    const { data: relationsData } = useQuery<GQLProductsSelectGridRelationsQuery, GQLProductsSelectGridRelationsQueryVariables>(
        productRelationsQuery,
    );
    const intl = useIntl();
    const theme = useTheme();

    const columns: GridColDef<GQLProductsSelectGridItemFragment>[] = [
        {
            field: "overview",
            headerName: "Overview",
            minWidth: 200,
            flex: 1,
            sortBy: ["title", "price", "type", "category"],
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
        },
        {
            field: "tags",
            headerName: "Tags",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => <>{params.row.tags.map((tag) => tag.title).join(", ")}</>,
            filterOperators: [
                {
                    value: "contains",
                    getApplyFilterFn: (filterItem) => {
                        throw new Error("not implemented, we filter server side");
                    },
                    InputComponent: GridFilterInputSingleSelect,
                },
            ],
            valueOptions: relationsData?.productTags.nodes.map((i) => ({ value: i.id, label: i.title })),
        },
    ];

    const { filter: gqlFilter, search: gqlSearch } = muiGridFilterToGql(columns, dataGridProps.filterModel);

    const { data, loading, error } = useQuery<GQLProductsSelectGridListQuery, GQLProductsSelectGridListQueryVariables>(productsQuery, {
        variables: {
            filter: gqlFilter,
            search: gqlSearch,
            offset: dataGridProps.page * dataGridProps.pageSize,
            limit: dataGridProps.pageSize,
            sort: muiGridSortToGql(sortModel, dataGridProps.apiRef),
        },
    });
    const rows = data?.products.nodes ?? [];
    const rowCount = useBufferedRowCount(data?.products.totalCount);

    return (
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
            checkboxSelection
            keepNonExistentRowsSelected
            selectionModel={value ? value : []}
            onSelectionModelChange={(newSelectionModel) => {
                onChange(newSelectionModel.map((rowId) => String(rowId)));
            }}
        />
    );
}

const productsFragment = gql`
    fragment ProductsSelectGridItem on Product {
        id
        title
        description
        price
        type
        additionalTypes
        inStock
        status
        category {
            id
            title
        }
        tags {
            id
            title
        }
    }
`;

const productsQuery = gql`
    query ProductsSelectGridList($offset: Int!, $limit: Int!, $sort: [ProductSort!], $filter: ProductFilter, $search: String) {
        products(offset: $offset, limit: $limit, sort: $sort, filter: $filter, search: $search) {
            nodes {
                id
                ...ProductsSelectGridItem
            }
            totalCount
        }
    }
    ${productsFragment}
`;

const productRelationsQuery = gql`
    query ProductsSelectGridRelations {
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
