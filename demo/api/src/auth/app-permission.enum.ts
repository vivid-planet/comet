import { registerEnumType } from "@nestjs/graphql";

export enum AppPermission {
    news = "news",
    products = "products",
}
registerEnumType(AppPermission, {
    name: "AppPermission",
});
