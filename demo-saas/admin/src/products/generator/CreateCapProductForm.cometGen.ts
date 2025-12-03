import { defineConfig } from "@comet/admin-generator";
import { type GQLProduct } from "@src/graphql.generated";

import { validateTitle } from "./validateTitle";

export default defineConfig<GQLProduct>({
    type: "form",
    gqlType: "Product",
    mode: "add",
    fragmentName: "CreateCapProductFormDetails",
    fields: [
        {
            type: "text",
            name: "title",
            label: "Titel", // default is generated from name (camelCaseToHumanReadable)
            required: true, // default is inferred from gql schema
            validate: validateTitle,
        },
        { type: "text", name: "slug" },
        { type: "text", name: "description", label: "Description", multiline: true },
        { type: "asyncSelect", name: "category", rootQuery: "productCategories" },
        { type: "boolean", name: "inStock" },
        { type: "date", name: "availableSince", startAdornment: { icon: "CalendarToday" } },
    ],
});
