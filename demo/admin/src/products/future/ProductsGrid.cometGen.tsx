import { GridCellContent } from "@comet/admin";
import { type GridConfig } from "@comet/admin-generator";
import { type GQLProduct } from "@src/graphql.generated";
import { type ReactNode } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";

import { ProductsGridPreviewAction } from "../ProductsGridPreviewAction";
import { ManufacturerFilterOperators } from "./ManufacturerFilter";
import { ProductTitle } from "./ProductTitle";

const typeValues = [{ value: "Cap", label: "great Cap" }, "Shirt", "Tie"];

export const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "ProductsGridFuture", // configurable as it must be unique across project
    filterProp: true,
    toolbarActionProp: true,
    rowActionProp: true,
    excelExport: true,
    queryParamsPrefix: "products",
    initialSort: [
        { field: "inStock", sort: "desc" },
        { field: "price", sort: "asc" },
    ],
    initialFilter: {
        items: [{ field: "type", operator: "is", value: "Shirt" }],
    },
    columns: [
        {
            type: "virtual",
            name: "overview",
            loadFields: ["category.title"],
            headerName: "Overview",
            minWidth: 200,
            renderCell: ({ row }) => {
                const typeLabels: Record<string, ReactNode> = {
                    Cap: <FormattedMessage id="product.overview.secondaryText.type.Cap" defaultMessage="great Cap" />,
                    Shirt: <FormattedMessage id="product.overview.secondaryText.type.Shirt" defaultMessage="Shirt" />,
                    Tie: <FormattedMessage id="product.overview.secondaryText.type.Tie" defaultMessage="Tie" />,
                };
                const inStockLabels: Record<string, ReactNode> = {
                    true: <FormattedMessage id="product.overview.secondaryText.inStock.true" defaultMessage="In stock" />,
                    false: <FormattedMessage id="product.overview.secondaryText.inStock.false" defaultMessage="Out of stock" />,
                };
                return (
                    <GridCellContent
                        primaryText={row.title ?? "-"}
                        secondaryText={
                            <FormattedMessage
                                id="product.overview.secondaryText"
                                defaultMessage="{price} • {type} • {category} • {inStock}"
                                values={{
                                    price:
                                        typeof row.price === "undefined" || row.price === null ? (
                                            <FormattedMessage id="product.overview.secondaryText.price.empty" defaultMessage="No price" />
                                        ) : (
                                            <FormattedNumber
                                                value={row.price}
                                                minimumFractionDigits={2}
                                                maximumFractionDigits={2}
                                                style="currency"
                                                currency="EUR"
                                            />
                                        ),
                                    type:
                                        row.type == null ? (
                                            <FormattedMessage id="product.overview.secondaryText.type.empty" defaultMessage="No type" />
                                        ) : (
                                            (typeLabels[`${row.type}`] ?? row.type)
                                        ),
                                    category: row.category?.title ?? (
                                        <FormattedMessage id="product.overview.secondaryText.category.empty" defaultMessage="No category" />
                                    ),
                                    inStock: row.inStock == null ? "-" : (inStockLabels[`${row.inStock}`] ?? row.inStock),
                                }}
                            />
                        }
                    />
                );
            },
            visible: "down('md')",
            sortBy: ["title", "price", "type", "category", "inStock"],
            disableExport: true, // TODO: Implement `valueFormatter` for type "combination"
        },
        {
            type: "text",
            renderCell: ({ value, row }) => <ProductTitle title={value} />,
            name: "title",
            headerName: "Custom",
            minWidth: 200,
            visible: "down('md')",
        },
        { type: "text", name: "title", headerName: "Titel", minWidth: 200, maxWidth: 250, visible: "up('md')" },
        { type: "text", name: "description", headerName: "Description" },
        // TODO: Allow setting options for `intl.formatNumber` through `valueFormatter` (type "number")
        { type: "number", name: "price", headerName: "Price", maxWidth: 150, headerInfoTooltip: "Price in EUR", visible: "up('md')" },
        {
            // TODO: Implement showing actual label in `valueFormatter` (type "staticSelect")
            type: "staticSelect",
            name: "inStock",
            headerName: "In stock",
            flex: 1,
            minWidth: 80,
            visible: "up('md')",
            values: [
                {
                    value: "true",
                    label: {
                        primaryText: "In stock",
                        icon: { name: "StateFilled", color: "success" },
                    },
                },
                {
                    value: "false",
                    label: {
                        primaryText: "Out of stock",
                        icon: { name: "StateFilled", color: "error" },
                    },
                },
            ],
        },
        // TODO: Implement showing actual label in `valueFormatter` (type "staticSelect")
        { type: "staticSelect", name: "type", maxWidth: 150, values: typeValues, visible: "up('md')" },
        // TODO: Allow setting options for `intl.formatDate` through `valueFormatter` (type "date")
        { type: "date", name: "availableSince", width: 140 },
        // TODO: Allow setting options for `intl.formatDate` through `valueFormatter` (type "dateTime")
        { type: "dateTime", name: "createdAt", width: 170 },
        {
            type: "text",
            name: "manufacturer.name",
            headerName: "Manufacturer",
            fieldName: "manufacturer",
            filterOperators: ManufacturerFilterOperators,
        },
        {
            type: "actions",
            component: ProductsGridPreviewAction,
        },
    ],
};
