import { registerEnumType } from "@nestjs/graphql";

export enum ProductType {
    cap = "cap",
    shirt = "shirt",
    tie = "tie",
    pants = "pants",
    jacket = "jacket",
    shoes = "shoes",
    socks = "socks",
    mug = "mug",
    pen = "pen",
    calendar = "calendar",
    notebook = "notebook",
    bag = "bag",
    watch = "watch",
    sunglasses = "sunglasses",
    wallet = "wallet",
}

registerEnumType(ProductType, {
    name: "ProductType",
});
