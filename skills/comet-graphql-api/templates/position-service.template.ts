// Only generate this service when the entity has a `position` field.
// File name: {{entity-names}}.service.ts (camelCase plural, e.g. productCategories.service.ts)

import { EntityManager, FilterQuery, raw } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { {{EntityName}} } from "../entities/{{entity-name}}.entity";

@Injectable()
export class {{EntityNames}}Service {
    constructor(protected readonly entityManager: EntityManager) {}

    // Use this simpler variant when position is global (no groupBy):
    async incrementPositions(lowestPosition: number, highestPosition?: number) {
        await this.entityManager.nativeUpdate(
            {{EntityName}},
            { position: { $gte: lowestPosition, ...(highestPosition ? { $lt: highestPosition } : {}) } },
            { position: raw("position + 1") },
        );
    }

    async decrementPositions(lowestPosition: number, highestPosition?: number) {
        await this.entityManager.nativeUpdate(
            {{EntityName}},
            { position: { $gt: lowestPosition, ...(highestPosition ? { $lte: highestPosition } : {}) } },
            { position: raw("position - 1") },
        );
    }

    async getLastPosition() {
        return this.entityManager.count({{EntityName}}, {});
    }

    // Use the variant below instead when position is scoped to a group
    // (i.e. @CrudGenerator had `position: { groupByFields: ["parentField"] }`):

    // async incrementPositions(group: { parentField: string }, lowestPosition: number, highestPosition?: number) {
    //     await this.entityManager.nativeUpdate(
    //         {{EntityName}},
    //         {
    //             $and: [
    //                 { position: { $gte: lowestPosition, ...(highestPosition ? { $lt: highestPosition } : {}) } },
    //                 this.getPositionGroupCondition(group),
    //             ],
    //         },
    //         { position: raw("position + 1") },
    //     );
    // }

    // async decrementPositions(group: { parentField: string }, lowestPosition: number, highestPosition?: number) {
    //     await this.entityManager.nativeUpdate(
    //         {{EntityName}},
    //         {
    //             $and: [
    //                 { position: { $gt: lowestPosition, ...(highestPosition ? { $lte: highestPosition } : {}) } },
    //                 this.getPositionGroupCondition(group),
    //             ],
    //         },
    //         { position: raw("position - 1") },
    //     );
    // }

    // async getLastPosition(group: { parentField: string }) {
    //     return this.entityManager.count({{EntityName}}, this.getPositionGroupCondition(group));
    // }

    // getPositionGroupCondition(group: { parentField: string }): FilterQuery<{{EntityName}}> {
    //     return { parentField: group.parentField };
    // }
}
