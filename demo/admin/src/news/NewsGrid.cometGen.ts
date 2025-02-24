import { type GridConfig } from "@comet/admin-generator";
import { type GQLNews } from "@src/graphql.generated";

export const NewsGrid: GridConfig<GQLNews> = {
    type: "grid",
    gqlType: "News",
    fragmentName: "NewsGrid",
    columns: [
        {
            type: "text",
            name: "title",
            headerName: "Title",
        },
        {
            type: "date",
            name: "date",
            headerName: "Date",
        },
        {
            type: "staticSelect",
            name: "category",
            headerName: "Category",
            values: ["Events", "Company", "Awards"],
        },
        {
            type: "block",
            name: "image",
            headerName: "Image",
            block: { name: "DamImageBlock", import: "@comet/cms-admin" },
        },
        {
            type: "block",
            name: "content",
            headerName: "Content",
            block: { name: "NewsContentBlock", import: "../blocks/NewsContentBlock" },
        },
    ],
};
