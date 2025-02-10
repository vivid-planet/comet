import { type future_GridConfig as GridConfig } from "@comet/cms-admin";
import { type StaticSelectLabelCellContent } from "@comet/cms-admin/lib/generator/future/generator";
import { type GQLProduct, type GQLProductStatus } from "@src/graphql.generated";

//TODO: i want to consume this type from Admin Generator in the application
type StaticSelectValueOption =
    | {
          value: string;
          label: string | StaticSelectLabelCellContent;
      }
    | string;
type StaticSelectValuesOption = Array<StaticSelectValueOption>;

const productStatusStaticValueOptionMap: Record<GQLProductStatus, StaticSelectValueOption> = {
    Published: "Published",
    Deleted: "Deleted",
    Unpublished: "Unpublished",
};

const requiredMapToStaticValues = (map: RequiredMap<string, StaticSelectValueOption>): StaticSelectValuesOption => {
    return Object.entries(map).map<StaticSelectValueOption>(([key, entry]) => {
        return entry;
    });
};

export const ProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",
    gqlType: "Product",
    fragmentName: "ProductsGridInitialFilterWithIsAnyOf", // configurable as it must be unique across project
    initialFilter: {
        items: [
            {
                field: "status",
                operator: "isAnyOf",
                value: ["Published" satisfies GQLProductStatus, "Unpublished" satisfies GQLProductStatus],
            },
        ],
    },
    columns: [
        { type: "text", name: "title" },
        {
            type: "staticSelect",
            name: "status",
            values: requiredMapToStaticValues(productStatusStaticValueOptionMap),
        },
    ],
};
