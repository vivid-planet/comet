import { EntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";

import { ACTION_LOGS_METADATA_KEY } from "../action-logs/action-logs.decorator";
import { PGMEMENTO_AUDIT_ID_COLUMN, PGMEMENTO_SCHEMA } from "./pgmemento.constants";

/**
 * Enables pgMemento auditing for every entity decorated with `@ActionLogs()`.
 *
 * This mirrors how the old `ActionLogsSubscriber` discovered audited entities (via the decorator
 * metadata), but instead of logging changes in Node it installs the database-side triggers once at
 * startup. The pgMemento schema itself (the `pgmemento.*` tables and functions) must already be
 * installed — see the migration / README in this folder.
 */
@Injectable()
export class PgMementoSetupService implements OnModuleInit {
    private readonly logger = new Logger(PgMementoSetupService.name);

    constructor(private readonly entityManager: EntityManager<PostgreSqlDriver>) {}

    async onModuleInit(): Promise<void> {
        if (!(await this.isPgMementoInstalled())) {
            this.logger.warn(`pgMemento schema "${PGMEMENTO_SCHEMA}" not found — skipping audit setup. Run the pgMemento install migration first.`);
            return;
        }

        for (const meta of Object.values(this.entityManager.getMetadata().getAll())) {
            if (!meta.class || !Reflect.hasOwnMetadata(ACTION_LOGS_METADATA_KEY, meta.class.prototype)) {
                continue;
            }
            await this.enableAuditing(meta.tableName, meta.schema ?? this.entityManager.config.get("schema") ?? "public");
        }
    }

    private async isPgMementoInstalled(): Promise<boolean> {
        const rows = await this.entityManager.execute<Array<{ exists: boolean }>>(
            "select exists(select 1 from information_schema.schemata where schema_name = ?) as exists",
            [PGMEMENTO_SCHEMA],
        );
        return rows[0]?.exists ?? false;
    }

    private async enableAuditing(tableName: string, schema: string): Promise<void> {
        if (await this.isAlreadyAudited(tableName, schema)) {
            return;
        }
        this.logger.log(`Enabling pgMemento auditing for "${schema}"."${tableName}"`);
        // log_old_data + log_new_data so the read model can both diff and reconstruct full snapshots.
        await this.entityManager.execute("select pgmemento.create_table_audit(?, ?, ?, true, true, false)", [
            tableName,
            schema,
            PGMEMENTO_AUDIT_ID_COLUMN,
        ]);
        // Baseline the current rows so pre-existing data has a "created" entry to diff against.
        await this.entityManager.execute("select pgmemento.log_table_baseline(?, ?, ?, true)", [tableName, schema, PGMEMENTO_AUDIT_ID_COLUMN]);
    }

    private async isAlreadyAudited(tableName: string, schema: string): Promise<boolean> {
        const rows = await this.entityManager.execute<Array<{ exists: boolean }>>(
            `select exists(
                select 1 from information_schema.columns
                where table_schema = ? and table_name = ? and column_name = ?
            ) as exists`,
            [schema, tableName, PGMEMENTO_AUDIT_ID_COLUMN],
        );
        return rows[0]?.exists ?? false;
    }
}
