import { registerEnumType } from "@nestjs/graphql";

export enum AppPermission {
    news = "news",
    products = "products",
    manufacturers = "manufacturers",
    tenants = "tenants",
}
registerEnumType(AppPermission, {
    name: "AppPermission",
});
