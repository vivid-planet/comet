import { registerEnumType } from "@nestjs/graphql";

export enum AppPermission {
    news = "news",
    products = "products",
    manufacturers = "manufacturers",
    tenantAdministration = "tenantAdministration",
}
registerEnumType(AppPermission, {
    name: "AppPermission",
});
