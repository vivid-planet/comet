// This file has been generated by comet api-generator.
// You may choose to use this file as scaffold by moving this file out of generated folder and removing this comment.
import { EntityManager, FilterQuery, raw } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ProductVariant } from "../entities/product-variant.entity";
@Injectable()
export class ProductVariantsService {
    constructor(protected readonly entityManager: EntityManager) { }
    async incrementPositions(group: {
        product: string;
    }, lowestPosition: number, highestPosition?: number) {
        // Increment positions between newPosition (inclusive) and oldPosition (exclusive)
        await this.entityManager.nativeUpdate(ProductVariant, {
            $and: [
                { position: { $gte: lowestPosition, ...(highestPosition ? { $lt: highestPosition } : {}) } },
                this.getPositionGroupCondition(group),
            ],
        }, { position: raw("position + 1") });
    }
    async decrementPositions(group: {
        product: string;
    }, lowestPosition: number, highestPosition?: number) {
        // Decrement positions between oldPosition (exclusive) and newPosition (inclusive)
        await this.entityManager.nativeUpdate(ProductVariant, {
            $and: [
                { position: { $gt: lowestPosition, ...(highestPosition ? { $lte: highestPosition } : {}) } },
                this.getPositionGroupCondition(group),
            ],
        }, { position: raw("position - 1") });
    }
    async getLastPosition(group: {
        product: string;
    }) {
        return this.entityManager.count(ProductVariant, this.getPositionGroupCondition(group));
    }
    getPositionGroupCondition(group: {
        product: string;
    }): FilterQuery<ProductVariant> {
        return {
            product: { $eq: group.product }
        };
    }
}
