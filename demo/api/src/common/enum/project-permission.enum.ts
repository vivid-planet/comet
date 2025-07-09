import { registerEnumType } from "@nestjs/graphql";

export enum ProjectPermission {
    news = "news",
    products = "products",
}
registerEnumType(ProjectPermission, {
    name: "ProjectPermission",
});
