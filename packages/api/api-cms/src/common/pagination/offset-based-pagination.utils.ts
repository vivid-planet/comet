import { FindOptions, QueryOrderMap } from "@mikro-orm/core";

import { OffsetBasedPaginationArgs } from "./offset-based.args";

export function getOffsetBasedPaginatedOptions<T = unknown>({ offset, limit }: OffsetBasedPaginationArgs): FindOptions<T> {
    return {
        offset,
        limit,
    };
}

export function getSortAndOffsetBasedPaginatedOptions<T = unknown>({ sort, ...args }: OffsetBasedPaginationArgs): FindOptions<T> {
    const { offset, limit } = getOffsetBasedPaginatedOptions(args);
    const orderBy: QueryOrderMap<unknown> | undefined = sort && {
        [sort.columnName]: sort.direction,
    };

    return {
        offset,
        limit,
        orderBy,
    };
}
