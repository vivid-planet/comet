import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

/* Barebones form for the Product entity */
export const ProductForm: FormConfig<GQLProduct> = {
    type: "form",

    /* __typename value of the Entity (GQLProduct) */
    gqlType: "Product",

    /* Unique name for the generated fragment */
    fragmentName: "ExampleProductForm",

    /* The Fields of the Form */
    fields: [
        { type: "text", name: "title", label: "Product Title" },
        { type: "text", name: "slug" },
    ],
};

/* Slightly advanced form for the Product entity */
// export const ProductForm: FormConfig<GQLProduct> = {
//     type: "form",

//     /* __typename value of the Entity (GQLProduct) */
//     gqlType: "Product",

//     /* Unique name for the generated fragment */
//     fragmentName: "ExampleProductForm",

//     /* The Fields of the Form */
//     fields: [
//         /* Fields with text value */
//         { type: "text", name: "title", label: "Product Title" },
//         { type: "text", name: "slug" },
//         { type: "text", name: "description", multiline: true },

//         /* Field with static select value */
//         {
//             type: "staticSelect",
//             name: "type",
//             values: ["Cap", "Shirt", "Tie"],
//         },

//         /* Field with block */
//         {
//             type: "block",
//             name: "image",
//             block: {
//                 name: "DamImageBlock",
//                 import: "@comet/cms-admin",
//             },
//         },
//     ],
// };
