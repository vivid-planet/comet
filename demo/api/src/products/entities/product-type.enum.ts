import { registerEnumType } from "@nestjs/graphql";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with camelCase
export enum ProductType {
    Cap = "Cap",
    Shirt = "Shirt",
    Tie = "Tie",
}
/* eslint-enable @typescript-eslint/naming-convention */
registerEnumType(ProductType, {
    name: "ProductType",
});
