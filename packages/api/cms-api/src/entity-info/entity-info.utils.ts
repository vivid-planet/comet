import type { AnyEntity, EntityManager, EntityMetadata, ObjectQuery } from "@mikro-orm/postgresql";

import type { EntityInfo, EntityInfoSql } from "./entity-info.decorator";

export function isEntityInfoSql(entityInfo: EntityInfo<AnyEntity>): entityInfo is EntityInfoSql {
    return typeof entityInfo === "object" && "sql" in entityInfo;
}

export function visibleConditionToSql(entityManager: EntityManager, metadata: EntityMetadata, visible: ObjectQuery<AnyEntity> | undefined): string {
    if (!visible) {
        return "true";
    }

    const qb = entityManager.createQueryBuilder(metadata.className, metadata.tableName);
    const query = qb.select("*").where(visible);
    const sql = query.getFormattedQuery();
    const sqlWhereMatch = sql.match(/^select .*? from .*? where (.*)/);
    if (!sqlWhereMatch) {
        throw new Error(`Could not extract where clause from query: ${sql}`);
    }
    return sqlWhereMatch[1];
}

export function requiredPermissionToSql(requiredPermission: string | string[] | undefined): string {
    if (!requiredPermission) {
        return "ARRAY[]::text[]";
    }
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    return `ARRAY[${permissions.map((p) => `'${p}'`).join(", ")}]::text[]`;
}
