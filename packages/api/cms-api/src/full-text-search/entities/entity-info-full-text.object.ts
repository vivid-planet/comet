import { ArrayType, Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { FullTextType } from "@mikro-orm/postgresql";

import { EntityInfoObject } from "../../entity-info/entity-info.object";

// Note: This file is intentionally not named *.entity.ts to exclude it from MikroORM's CLI migration glob pattern.
// The "EntityInfoFullText" view is created dynamically at startup by FullTextSearchService, not via migrations.

@Entity({ tableName: "EntityInfoFullText" })
export class EntityInfoFullTextObject {
    @PrimaryKey({ type: "text", persist: false })
    id: string;

    @PrimaryKey({ type: "text", persist: false })
    entityName: string;

    @Property({ type: FullTextType })
    fullText: string;

    @Property({ type: ArrayType })
    requiredPermission: string[];

    // Read-only join to the EntityInfo view (shares the id + entityName columns) to reuse its name, secondaryInformation and visible.
    @OneToOne(() => EntityInfoObject, {
        joinColumns: ["id", "entityName"],
        referencedColumnNames: ["id", "entityName"],
    })
    entityInfo: EntityInfoObject;
}
