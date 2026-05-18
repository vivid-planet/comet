import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { FullTextType } from "@mikro-orm/postgresql";

// Note: This file is intentionally not named *.entity.ts to exclude it from MikroORM's CLI migration glob pattern.
// The "EntityInfoFullText" view is created dynamically at startup by FullTextSearchService, not via migrations.

@Entity({ tableName: "EntityInfoFullText" })
export class EntityInfoFullTextObject {
    @PrimaryKey({ type: "text" })
    id: string;

    @PrimaryKey({ type: "text" })
    entityName: string;

    @Property({ type: FullTextType })
    fullText: string;
}
