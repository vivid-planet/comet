import { registerEnumType } from "@nestjs/graphql";

export enum RedirectSourceTypeValues {
    "path" = "path",
    "domain" = "domain",
}
registerEnumType(RedirectSourceTypeValues, { name: "RedirectSourceTypeValues" });

export enum RedirectGenerationType {
    "manual" = "manual",
    "automatic" = "automatic",
}
registerEnumType(RedirectGenerationType, { name: "RedirectGenerationType" });
