import { registerEnumType } from "@nestjs/graphql";

export enum ProductType {
    cap = "cap",
    shirt = "shirt",
    tie = "tie",
}
registerEnumType(ProductType, {
    name: "ProductType",
});
