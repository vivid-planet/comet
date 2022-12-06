import { QueryBuilder } from "@mikro-orm/postgresql";

import { SortDirection } from "../../sorting/sort-direction.enum";
import { CursorBasedPaginationArgs } from "./cursor-based.args";
import { PageInfo } from "./page-info";

/**
 * Based on https://gist.github.com/tumainimosha/6652deb0aea172f7f2c4b2077c72d16c
 */
export async function paginate<T extends { id: string; createdAt: Date }>(
    query: QueryBuilder<T>,
    paginationArgs: CursorBasedPaginationArgs,
    cursorColumn = "createdAt" as keyof T,
    defaultLimit = 25,
): Promise<{
    edges: {
        node: T;
        cursor: string;
    }[];
    pageInfo: PageInfo;
}> {
    const order = paginationArgs.first ? SortDirection.DESC : SortDirection.ASC;
    query.orderBy({ [`${query.alias}.${String(cursorColumn)}`]: order });

    const cursorQuery = query.clone();
    const beforeQuery = query.clone();
    const afterQuery = query.clone();

    // FORWARD pagination
    if (paginationArgs.first) {
        if (paginationArgs.after) {
            const entity = await cursorQuery.where({ id: paginationArgs.after }).getSingleResult();

            query.andWhere(`${query.alias}.${String(cursorColumn)} < ?`, [entity?.[cursorColumn]]);
        }

        const limit = paginationArgs.first ?? defaultLimit;

        query.limit(limit);
    }

    // REVERSE pagination
    else if (paginationArgs.last && paginationArgs.before) {
        const entity = await cursorQuery.where({ id: paginationArgs.before }).getSingleResult();

        const limit = paginationArgs.last ?? defaultLimit;

        query
            .andWhere(`${query.alias}.${String(cursorColumn)} > ?`, [entity?.[cursorColumn]])
            .andWhere(`${query.alias}.id != ?`, [entity?.id])
            .limit(limit);
    }

    let result = await query.getResult();

    if (paginationArgs.last && paginationArgs.before) {
        result = result.reverse();
    }

    const startCursor = result.length > 0 ? result[0] : null;
    const endCursor = result.length > 0 ? result[result.length - 1] : null;

    let countBefore = 0;
    let countAfter = 0;

    if (startCursor) {
        countBefore = await beforeQuery
            .andWhere(`${query.alias}.id != ?`, [startCursor.id])
            .andWhere(`${query.alias}.${String(cursorColumn)} > ?`, [startCursor[cursorColumn]])
            .getCount();
    }

    if (endCursor) {
        countAfter = await afterQuery
            .andWhere(`${query.alias}.id != :endCursorId`, [endCursor.id])
            .andWhere(`${query.alias}.${String(cursorColumn)} < :endCursor`, [endCursor[cursorColumn]])
            .getCount();
    }

    const edges = result.map((value) => {
        return {
            node: value,
            cursor: value.id,
        };
    });

    const pageInfo = new PageInfo({ edges, countBefore, countAfter });

    return { edges, pageInfo };
}
