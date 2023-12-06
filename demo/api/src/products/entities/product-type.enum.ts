import { registerEnumType } from "@nestjs/graphql";

export enum ProductType {
    Cap = "Cap",
    Shirt = "Shirt",
    Tie = "Tie",
}
registerEnumType(ProductType, {
    name: "ProductType",
});
