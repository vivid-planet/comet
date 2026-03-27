import { BlockTransformerServiceInterface } from "@comet/cms-api";
import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Product } from "@src/products/entities/product.entity";

import { PlaceholderBlockData } from "./placeholder.block";

type TransformResponse = {
    productId?: string;
    field: string;
    productTitle?: string;
    productPrice?: string;
    value?: string;
};

@Injectable()
export class PlaceholderBlockTransformerService implements BlockTransformerServiceInterface<PlaceholderBlockData, TransformResponse> {
    constructor(private readonly entityManager: EntityManager) {}

    async transformToPlain(block: PlaceholderBlockData): Promise<TransformResponse> {
        if (!block.productId) {
            return { field: block.field };
        }

        const product = await this.entityManager.findOne(Product, block.productId);

        if (!product) {
            return { productId: block.productId, field: block.field };
        }

        let value: string | undefined;
        switch (block.field) {
            case "title":
                value = product.title;
                break;
            case "price":
                value = product.price != null ? String(product.price) : undefined;
                break;
        }

        return {
            productId: block.productId,
            field: block.field,
            productTitle: product.title,
            productPrice: product.price != null ? String(product.price) : undefined,
            value,
        };
    }
}
