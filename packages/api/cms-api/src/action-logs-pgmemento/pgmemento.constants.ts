import { ActionLogType } from "../action-logs/dto/action-log-type.enum";

/**
 * pgMemento stores the kind of a change as an integer `op_id` on
 * `pgmemento.table_event_log`. The values are defined by pgMemento's
 * `get_operation_id` function (see src/SETUP.sql upstream).
 */
export enum PgMementoOperation {
    createTable = 1,
    addColumn = 2,
    insert = 3,
    update = 4,
    alterColumn = 5,
    dropColumn = 6,
    delete = 7,
    truncate = 8,
    dropTable = 9,
}

export const PGMEMENTO_SCHEMA = "pgmemento";

/** The audit-id column pgMemento adds to every audited table (its default name). */
export const PGMEMENTO_AUDIT_ID_COLUMN = "pgmemento_audit_id";

/** Key under which the acting user is stored in `transaction_log.session_info`. */
export const PGMEMENTO_SESSION_USER_KEY = "client_user";

export function actionLogTypeFromOperation(opId: number): ActionLogType {
    switch (opId) {
        case PgMementoOperation.insert:
            return ActionLogType.Created;
        case PgMementoOperation.delete:
        case PgMementoOperation.truncate:
            return ActionLogType.Deleted;
        default:
            return ActionLogType.Updated;
    }
}
