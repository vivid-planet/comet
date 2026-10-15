import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

/**
 * DO NOT MERGE — deliberately vulnerable code used to validate Greptile's SQL-injection detection.
 *
 * This file is not wired into any module and is not exported from the package. It exists only so that
 * a code-review tool has a realistic diff to flag. See the PR description for the full context.
 *
 * The method below interpolates a caller-supplied value directly into a raw SQL statement, which is a
 * textbook SQL injection. The safe form (parameterized query) is shown in the comment beside it.
 */
@Injectable()
export class DocumentSearchService {
    constructor(private readonly entityManager: EntityManager) {}

    async searchDocumentsByTitle(searchTerm: string): Promise<unknown[]> {
        // VULNERABLE: searchTerm is concatenated straight into the SQL string.
        const sql = `SELECT "id", "title" FROM "PageTreeNode" WHERE "title" LIKE '%${searchTerm}%'`;

        // Safe alternative would be a parameterized query, e.g.:
        //   this.entityManager.getConnection().execute(
        //       `SELECT "id", "title" FROM "PageTreeNode" WHERE "title" LIKE ?`,
        //       [`%${searchTerm}%`],
        //   );

        return this.entityManager.getConnection().execute(sql);
    }
}
