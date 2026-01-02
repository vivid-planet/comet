import { BrevoPermission } from "@comet/brevo-api";
import { registerEnumType } from "@nestjs/graphql";

enum BaseAppPermission {
    news = "news",
    products = "products",
    manufacturers = "manufacturers",
}

export const AppPermission = { ...BaseAppPermission, ...BrevoPermission } as const;
export type AppPermission = BaseAppPermission | BrevoPermission;

registerEnumType(AppPermission, {
    name: "AppPermission",
});
