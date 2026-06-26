import { type AnyEntity, EntityManager, type EntityMetadata, type EntityName, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";

import { ActionLogSort } from "../action-logs/dto/action-log.sort";
import { ActionLogType } from "../action-logs/dto/action-log-type.enum";
import { SortDirection } from "../common/sorting/sort-direction.enum";
import { ContentScope } from "../user-permissions/interfaces/content-scope.interface";
import { MappedActionLog } from "./mapped-action-log";
import { actionLogTypeFromOperation, PGMEMENTO_SCHEMA, PGMEMENTO_SESSION_USER_KEY } from "./pgmemento.constants";

interface RawEvent {
    rowLogId: string;
    opId: number;
    txidTime: Date;
    sessionInfo: Record<string, unknown> | null;
    oldData: Record<string, unknown> | null;
    newData: Record<string, unknown> | null;
}

@Injectable()
export class PgMementoActionLogsService {
    constructor(private readonly entityManager: EntityManager<PostgreSqlDriver>) {}

    async findManyForEntity<T extends AnyEntity>({
        entityName,
        entityId,
        offset = 0,
        limit,
        sort,
    }: {
        entityName: EntityName<T>;
        entityId: string;
        offset?: number;
        limit?: number;
        sort?: ActionLogSort[];
    }): Promise<{ nodes: MappedActionLog[]; totalCount: number }> {
        const history = await this.loadHistory(entityName, entityId);
        const sorted = this.applySort(history, sort);
        const nodes = limit != null ? sorted.slice(offset, offset + limit) : sorted.slice(offset);
        return { nodes, totalCount: history.length };
    }

    async findOneForEntity<T extends AnyEntity>({
        entityName,
        entityId,
        id,
    }: {
        entityName: EntityName<T>;
        entityId: string;
        id: string;
    }): Promise<MappedActionLog | null> {
        const history = await this.loadHistory(entityName, entityId);
        return history.find((actionLog) => actionLog.id === id) ?? null;
    }

    /**
     * Loads the full, chronologically ordered change history of a single entity and maps it to the
     * `ActionLog` shape. Version numbers, the change type and full snapshots are derived here from
     * pgMemento's delta log — the database stores only what changed, not a snapshot per version.
     */
    private async loadHistory<T extends AnyEntity>(entityName: EntityName<T>, entityId: string): Promise<MappedActionLog[]> {
        const meta = this.entityManager.getMetadata().get(entityName);
        const { tableName, schema, primaryKeyColumn } = this.getTableInfo(meta);

        const events = await this.entityManager.execute<RawEvent[]>(
            `select
                r.id::text as "rowLogId",
                e.op_id as "opId",
                t.txid_time as "txidTime",
                t.session_info as "sessionInfo",
                r.old_data as "oldData",
                r.new_data as "newData"
            from ${PGMEMENTO_SCHEMA}.row_log r
            join ${PGMEMENTO_SCHEMA}.table_event_log e on e.event_key = r.event_key
            join ${PGMEMENTO_SCHEMA}.transaction_log t on t.id = e.transaction_id
            where e.schema_name = ?
                and e.table_name = ?
                and coalesce(r.new_data ->> ?, r.old_data ->> ?) = ?
            order by t.txid_time asc, e.id asc, r.id asc`,
            [schema, tableName, primaryKeyColumn, primaryKeyColumn, entityId],
        );

        const columnToProperty = this.getColumnToPropertyMap(meta);
        const ignoredColumns = this.getRelationColumns(meta);

        const history: MappedActionLog[] = [];
        let accumulatedRow: Record<string, unknown> = {};
        let previousVersion: MappedActionLog | null = null;

        for (const [index, event] of events.entries()) {
            const type = actionLogTypeFromOperation(event.opId);

            let snapshot: Record<string, unknown> | undefined;
            if (type === ActionLogType.Deleted) {
                snapshot = undefined;
                accumulatedRow = {};
            } else {
                // pgMemento logs full rows on INSERT and only changed columns on UPDATE (when
                // configured to log new values). Folding the deltas reconstructs the full state.
                accumulatedRow = { ...accumulatedRow, ...(event.newData ?? {}) };
                snapshot = this.toSnapshot(accumulatedRow, columnToProperty, ignoredColumns);
            }

            const mapped: MappedActionLog = {
                id: event.rowLogId,
                entityName: typeof entityName === "string" ? entityName : meta.className,
                entityId,
                version: index + 1,
                userId: this.getUserId(event.sessionInfo),
                createdAt: event.txidTime,
                snapshot,
                scope: snapshot ? this.getScope(snapshot, meta) : undefined,
                type,
                previousVersion,
            };
            history.push(mapped);
            previousVersion = mapped;
        }

        return history;
    }

    private applySort(history: MappedActionLog[], sort?: ActionLogSort[]): MappedActionLog[] {
        if (!sort?.length) {
            return history;
        }
        const sorted = [...history];
        sorted.sort((a, b) => {
            for (const { field, direction } of sort) {
                const left = this.sortValue(a, field);
                const right = this.sortValue(b, field);
                if (left < right) {
                    return direction === SortDirection.ASC ? -1 : 1;
                }
                if (left > right) {
                    return direction === SortDirection.ASC ? 1 : -1;
                }
            }
            return 0;
        });
        return sorted;
    }

    private sortValue(actionLog: MappedActionLog, field: ActionLogSort["field"]): number {
        return String(field) === "createdAt" ? actionLog.createdAt.getTime() : actionLog.version;
    }

    private getUserId(sessionInfo: Record<string, unknown> | null): string {
        const userId = sessionInfo?.[PGMEMENTO_SESSION_USER_KEY];
        return typeof userId === "string" ? userId : "system";
    }

    private getTableInfo(meta: EntityMetadata): { tableName: string; schema: string; primaryKeyColumn: string } {
        const primaryKey = meta.getPrimaryProps()[0];
        return {
            tableName: meta.tableName,
            schema: meta.schema ?? this.entityManager.config.get("schema") ?? "public",
            primaryKeyColumn: primaryKey.fieldNames[0],
        };
    }

    private getColumnToPropertyMap(meta: EntityMetadata): Map<string, string> {
        const map = new Map<string, string>();
        for (const prop of meta.props) {
            if (prop.fieldNames?.length === 1) {
                map.set(prop.fieldNames[0], prop.name);
            }
        }
        return map;
    }

    private getRelationColumns(meta: EntityMetadata): Set<string> {
        const columns = new Set<string>();
        for (const relation of meta.relations) {
            for (const fieldName of relation.fieldNames ?? []) {
                columns.add(fieldName);
            }
        }
        return columns;
    }

    private toSnapshot(row: Record<string, unknown>, columnToProperty: Map<string, string>, ignoredColumns: Set<string>): Record<string, unknown> {
        const snapshot: Record<string, unknown> = {};
        for (const [column, value] of Object.entries(row)) {
            if (ignoredColumns.has(column)) {
                continue;
            }
            snapshot[columnToProperty.get(column) ?? column] = value;
        }
        return snapshot;
    }

    /**
     * Best-effort scope derivation from the reconstructed snapshot. Covers entities with a jsonb
     * `scope` column and embeddable scopes stored as `scope_*` columns. Relation-derived scopes
     * (see `@ScopedEntity`) are not reconstructed here — see the prototype README.
     */
    private getScope(snapshot: Record<string, unknown>, meta: EntityMetadata): ContentScope[] | undefined {
        if (!meta.props.some((prop) => prop.name === "scope")) {
            return undefined;
        }
        if (snapshot.scope != null && typeof snapshot.scope === "object") {
            const scope = snapshot.scope as ContentScope;
            return [scope];
        }
        const embeddedScope: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(snapshot)) {
            if (key.startsWith("scope_")) {
                embeddedScope[key.slice("scope_".length)] = value;
            }
        }
        return Object.keys(embeddedScope).length > 0 ? [embeddedScope as ContentScope] : undefined;
    }
}
