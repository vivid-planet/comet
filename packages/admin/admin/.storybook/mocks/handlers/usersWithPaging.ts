import { graphql, HttpResponse } from "msw";

import { users, type User } from "./users";

export const usersWithPagingHandler = graphql.query<
    {
        usersWithPaging: {
            nodes: User[];
            totalCount: number;
            nextPage?: number;
            previousPage?: number;
            totalPages?: number;
        };
    },
    { query?: string; sort?: string; order?: string; page?: number; size?: number }
>("UsersWithPaging", ({ variables }) => {
    const query = variables.query?.toLowerCase() ?? "";
    const sort = variables.sort;
    const order = variables.order?.toUpperCase() ?? "ASC";
    const page = variables.page ?? 1;
    const size = variables.size ?? 5;

    let filtered = query ? users.filter((user) => user.name.toLowerCase().includes(query)) : [...users];

    if (sort) {
        filtered = filtered.sort((a, b) => {
            const aVal = a[sort as keyof User] as string | number;
            const bVal = b[sort as keyof User] as string | number;
            const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return order === "DESC" ? -cmp : cmp;
        });
    }

    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / size);
    const nodes = filtered.slice((page - 1) * size, page * size);

    return HttpResponse.json({
        data: {
            usersWithPaging: {
                nodes,
                totalCount,
                totalPages,
                nextPage: page < totalPages ? page + 1 : undefined,
                previousPage: page > 1 ? page - 1 : undefined,
            },
        },
    });
});
