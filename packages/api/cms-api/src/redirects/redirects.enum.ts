import { registerEnumType } from "@nestjs/graphql";

export enum RedirectSourceTypeValues {
    "path" = "path",
}
registerEnumType(RedirectSourceTypeValues, { name: "RedirectSourceTypeValues" });

export enum RedirectGenerationType {
    "manual" = "manual",
    "automatic" = "automatic",
}
registerEnumType(RedirectGenerationType, { name: "RedirectGenerationType" });
