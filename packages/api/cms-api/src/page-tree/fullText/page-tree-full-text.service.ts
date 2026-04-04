import { EntityManager } from "@mikro-orm/postgresql";
import { Inject, Injectable, Type } from "@nestjs/common";

import { DocumentInterface } from "../../document/dto/document-interface";
import { PAGE_TREE_DOCUMENTS } from "../page-tree.constants";

@Injectable()
export class PageTreeFullTextService {
    constructor(
        @Inject(PAGE_TREE_DOCUMENTS) private readonly documents: Type<DocumentInterface>[],
        private entityManager: EntityManager,
    ) {}

    async createPageTreeFullTextView(): Promise<void> {
        const indexSelects: string[] = [];

        const metadataStorage = this.entityManager.getMetadata();

        for (const entity of this.documents) {
            const metadata = metadataStorage.get(entity.name);
            const primary = metadata.primaryKeys[0];

            // Find all tsvector (FullTextType) columns
            const fulltextColumns = metadata.props.filter((prop) => prop.columnTypes && prop.columnTypes.some((ct) => ct === "tsvector"));

            if (fulltextColumns.length === 0) continue;

            const fulltextExpr = fulltextColumns.map((col) => `COALESCE("${metadata.tableName}"."${col.fieldNames[0]}", ''::tsvector)`).join(" || ");

            const select = `SELECT
                            "${metadata.tableName}"."${primary}" AS "documentId",
                            '${metadata.name}' AS "type",
                            ${fulltextExpr} AS "fullText"
                        FROM "${metadata.tableName}"`;

            indexSelects.push(select);
        }

        if (indexSelects.length === 0) {
            throw new Error("PageTree fulltext is enabled but no document entities with fulltext columns found");
        }

        const viewSql = indexSelects.join("\n UNION ALL \n");

        console.time("creating PageTreeDocumentFullText view");
        await this.entityManager.getConnection().execute(`CREATE VIEW "PageTreeDocumentFullText" AS ${viewSql}`);
        console.timeEnd("creating PageTreeDocumentFullText view");

        console.time("creating PageTreeNodeFullText view");
        await this.entityManager.getConnection().execute(
            `CREATE VIEW "PageTreeNodeFullText" AS
                SELECT "ad"."pageTreeNodeId", "ft"."fullText"
                FROM "PageTreeDocumentFullText" "ft"
                INNER JOIN "PageTreeNodeDocument" "ad" ON "ad"."documentId" = "ft"."documentId" AND "ad"."type" = "ft"."type"`,
        );
        console.timeEnd("creating PageTreeNodeFullText view");
    }

    async dropPageTreeFullTextView(): Promise<void> {
        await this.entityManager.getConnection().execute(`DROP VIEW IF EXISTS "PageTreeNodeFullText"`);
        await this.entityManager.getConnection().execute(`DROP VIEW IF EXISTS "PageTreeDocumentFullText"`);
    }
}
