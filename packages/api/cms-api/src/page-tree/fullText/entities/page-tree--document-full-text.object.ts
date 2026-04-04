import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { FullTextType } from "@mikro-orm/postgresql";

// Note: This file is intentionally not named *.entity.ts to exclude it from MikroORM's CLI migration glob pattern.
// The "PageTreeDocumentFulltext" view is created dynamically at startup by PageTreeFullTextService, not via migrations.

@Entity({ tableName: "PageTreeDocumentFullText" })
export class PageTreeDocumentFullText {
    @PrimaryKey({ type: "text" })
    documentId: string;

    @Property({ type: "text" })
    type: string;

    @Property({ type: FullTextType })
    fullText: string;
}
