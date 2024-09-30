import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLProduct } from "@src/graphql.generated";

/* Barebones grid for the Product entity */
export const ExampleProductsGrid: GridConfig<GQLProduct> = {
    type: "grid",

    /* __typename value of the Entity (GQLProduct) */
    gqlType: "Product",

    /* Unique name for the generated fragment */
    fragmentName: "ExampleProductsGrid",

    /* The Columns of the Grid */
    columns: [
        { type: "text", name: "title", headerName: "Product Title" },
        { type: "text", name: "slug" },
    ],
};

/* Sliglty advanced grid for the Product entity */
// export const ExampleProductsGrid: GridConfig<GQLProduct> = {
//     type: "grid",

//     /* __typename value of the Entity (GQLProduct) */
//     gqlType: "Product",

//     /* Unique name for the generated fragment */
//     fragmentName: "ExampleProductsGrid",

//     columns: [
//         /* Columns with text value */
//         { type: "text", name: "title", headerName: "Product Title" },
//         { type: "text", name: "slug" },
//         { type: "text", name: "description" },

//         /* Column with static select value */
//         {
//             type: "staticSelect",
//             name: "type",
//             values: [
//                 {
//                     value: "Cap",
//                     label: {
//                         icon: {
//                             name: "Favorite",
//                             color: "primary",
//                         },
//                         primaryText: "This is a cap",
//                         secondaryText: "And that's awesome",
//                     },
//                 },
//                 {
//                     value: "Shirt",
//                     label: "This is a shirt",
//                 },
//                 {
//                     value: "Tie",
//                     label: "This is a tie",
//                 },
//             ],
//         },

//         /* Column with an image block */
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

/* Grid optimized for mobile devices */
// export const ExampleProductsGrid: GridConfig<GQLProduct> = {
//     type: "grid",
//     gqlType: "Product",
//     fragmentName: "ExampleProductsGrid",

//     columns: [
//         {
//             /* Column for combined data on mobile devices */
//             type: "combination",
//             name: "overview",
//             sortBy: ["title", "type"],
//             primaryText: {
//                 type: "formattedMessage",
//                 message: "{title} ({type})",
//                 valueFields: {
//                     title: "title",
//                     type: {
//                         type: "staticSelect",
//                         field: "type",
//                         values: ["Cap", "Shirt", "Tie"],
//                     },
//                 },
//             },
//             secondaryText: "slug",
//             minWidth: 200,
//             visible: "down('md')",
//         },

//         /* Text columns - only shown on larger devices */
//         { type: "text", name: "title", headerName: "Product Title", visible: "up('md')" },
//         { type: "text", name: "slug", visible: "up('md')" },

//         /* Wider text column - shown on all devices */
//         { type: "text", name: "description", minWidth: 200 },

//         /* Static select column - only shown on larger devices */
//         {
//             type: "staticSelect",
//             name: "type",
//             visible: "up('md')",
//             values: [
//                 {
//                     value: "Cap",
//                     label: "This is a cap",
//                 },
//                 {
//                     value: "Shirt",
//                     label: "This is a shirt",
//                 },
//                 {
//                     value: "Tie",
//                     label: "This is a tie",
//                 },
//             ],
//         },

//         /* Image block column - shown on all devices */
//         {
//             type: "block",
//             name: "image",
//             minWidth: 200,
//             block: {
//                 name: "DamImageBlock",
//                 import: "@comet/cms-admin",
//             },
//         },
//     ],
// };
