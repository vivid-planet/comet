import { registerEnumType } from "@nestjs/graphql";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with PascalCase
export enum RedirectSourceTypeValues {
    "path" = "path",
}
/* eslint-enable @typescript-eslint/naming-convention */
registerEnumType(RedirectSourceTypeValues, { name: "RedirectSourceTypeValues" });

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with PascalCase
export enum RedirectGenerationType {
    "manual" = "manual",
    "automatic" = "automatic",
}
/* eslint-enable @typescript-eslint/naming-convention */
registerEnumType(RedirectGenerationType, { name: "RedirectGenerationType" });
