import { BlockData, BlockField, BlockInput, blockInputToData, createBlock } from "@comet/cms-api";
import { IsArray, IsEnum } from "class-validator";

export enum ProductList {
    cap = "cap",
    shirt = "shirt",
    tie = "tie",
}

class ProductListBlockData extends BlockData {
    @BlockField({ type: "enum", enum: ProductList, array: true })
    products: ProductList[];
}

class ProductListBlockInput extends BlockInput {
    @IsArray()
    @IsEnum(ProductList, { each: true })
    @BlockField({ type: "enum", enum: ProductList, array: true })
    products: ProductList[];

    transformToBlockData(): ProductListBlockData {
        return blockInputToData(ProductListBlockData, this);
    }
}

export const ProductListBlock = createBlock(ProductListBlockData, ProductListBlockInput, "ProductList");
