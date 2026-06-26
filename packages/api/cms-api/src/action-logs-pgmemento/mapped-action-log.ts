import type { ActionLogType } from "../action-logs/dto/action-log-type.enum";
import type { ContentScope } from "../user-permissions/interfaces/content-scope.interface";

/**
 * In-memory representation of a single audited change, reconstructed from pgMemento's log tables.
 *
 * It intentionally carries the same fields as the `ActionLog` entity of the old implementation, so
 * the existing GraphQL `ActionLog` type and the Admin UI work unchanged. Unlike the old
 * implementation, nothing here is persisted in a dedicated table — every value is derived on read
 * from `pgmemento.row_log` / `table_event_log` / `transaction_log`.
 */
export interface MappedActionLog {
    id: string;
    scope?: ContentScope[];
    userId: string;
    entityName: string;
    entityId: string;
    version: number;
    snapshot?: Record<string, unknown>;
    createdAt: Date;
    type: ActionLogType;
    /** The directly preceding version of the same entity, or null for the first version. */
    previousVersion: MappedActionLog | null;
}
