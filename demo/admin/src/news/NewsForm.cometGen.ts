import { future_FormConfig as FormConfig } from "@comet/cms-admin";
import { GQLNews } from "@src/graphql.generated";

export const NewsForm: FormConfig<GQLNews> = {
    type: "form",
    gqlType: "News",
    fragmentName: "NewsForm",
    fields: [
        {
            type: "text",
            name: "slug",
            label: "Slug",
            required: true,
        },
        {
            type: "text",
            name: "title",
            label: "Title",
            required: true,
        },
        {
            type: "date",
            name: "date",
            label: "Date",
            required: true,
        },
        {
            type: "staticSelect",
            name: "category",
            label: "Category",
            required: true,
            inputType: "radio",
            values: ["events", "company", "awards"],
        },
        {
            type: "block",
            name: "image",
            label: "Image",
            block: { name: "DamImageBlock", import: "@comet/cms-admin" },
        },
        {
            type: "block",
            name: "content",
            label: "Content",
            block: { name: "NewsContentBlock", import: "../blocks/NewsContentBlock" },
        },
    ],
};
