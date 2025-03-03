import { registerEnumType } from "@nestjs/graphql";

export enum ProductType {
    Cap = "Cap",
    Shirt = "Shirt",
    Tie = "Tie",
    Pants = "Pants",
    Jacket = "Jacket",
    Shoes = "Shoes",
    Socks = "Socks",
    Mug = "Mug",
    Pen = "Pen",
    Calendar = "Calendar",
    Notebook = "Notebook",
    Bag = "Bag",
    Watch = "Watch",
    Sunglasses = "Sunglasses",
    Wallet = "Wallet",
}

registerEnumType(ProductType, {
    name: "ProductType",
});
