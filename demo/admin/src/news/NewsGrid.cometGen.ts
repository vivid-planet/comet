import { future_GridConfig as GridConfig } from "@comet/cms-admin";
import { GQLNews } from "@src/graphql.generated";

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
            values: ["events", "company", "awards"],
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
