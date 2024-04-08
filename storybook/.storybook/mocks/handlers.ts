import { faker } from "@faker-js/faker";
import { mswResolver } from "@graphql-mocks/network-msw";
import { compareAsc, compareDesc } from "date-fns";
import { GraphQLFieldResolver } from "graphql";
import { GraphQLHandler } from "graphql-mocks";
import { ResponseResolver, rest } from "msw";
import { RestContext } from "msw/lib/types/handlers/RestHandler";

export type Launch = {
    id: string;
    mission_name: string;
    launch_date_local: Date;
};

export type LaunchesPastResult = {
    data: Launch[];
    result: {
        totalCount: number;
    };
};

export type LaunchesPastPagePagingResult = {
    nodes: Launch[];
    totalCount: number;
    nextPage?: number;
    previousPage?: number;
    totalPages?: number;
};

const allLaunches: Launch[] = [];

for (let i = 0; i < 100; i += 1) {
    allLaunches.push({
        id: faker.datatype.uuid(),
        mission_name: faker.word.adjective(),
        launch_date_local: faker.datatype.datetime(),
    });
}

const graphqlSchema = `
schema {
  query: Query
}

scalar Date

type Launch {
    id: ID!
    mission_name: String!
    launch_date_local: Date!
}

type Result {
    totalCount: Int!
}

type LaunchesPastResult {
    data: [Launch!]!
    result: Result!
}

type LaunchesPastPagePagingResult {
    nodes: [Launch!]!
    totalCount: Int!
    nextPage: Int
    previousPage: Int
    totalPages: Int
}

type Query {
    launchesPastResult(limit: Int, offset: Int, sort: String, order: String): LaunchesPastResult!
    launchesPastPagePaging(page: Int, size: Int): LaunchesPastPagePagingResult!
}
`;

const launchesPastResult: GraphQLFieldResolver<unknown, unknown, { limit?: number; offset?: number; sort?: string; order?: "asc" | "desc" }> = (
    parent,
    args,
) => {
    const { limit, offset, sort, order } = args;

    let launches = [...allLaunches];

    if (sort && order) {
        launches = launches.sort((a, b) => {
            if (sort === "mission_name") {
                if (order === "asc") {
                    return a.mission_name.localeCompare(b.mission_name);
                } else {
                    return b.mission_name.localeCompare(a.mission_name);
                }
            } else {
                if (order === "asc") {
                    return compareAsc(a.launch_date_local, b.launch_date_local);
                } else {
                    return compareDesc(a.launch_date_local, b.launch_date_local);
                }
            }
        });
    }

    return {
        data: offset !== undefined && limit ? launches.slice(offset, offset + limit) : launches,
        result: {
            totalCount: launches.length,
        },
    };
};

const launchesPastPagePaging: GraphQLFieldResolver<unknown, unknown, { page?: number; size?: number }> = (
    parent,
    { page = 1, size = 20 },
): LaunchesPastPagePagingResult => {
    const launches = [...allLaunches];
    const totalCount = launches.length;

    return {
        nodes: launches.slice((page - 1) * size, page * size),
        totalCount: totalCount,
        nextPage: totalCount > page * size ? page + 1 : undefined,
        previousPage: page > 1 ? page - 1 : undefined,
        totalPages: Math.ceil(totalCount / size),
    };
};

const launchesPastRest: ResponseResolver = (req, res, ctx: RestContext) => {
    return res(ctx.status(200), ctx.json(allLaunches));
};

const graphqlHandler = new GraphQLHandler({
    resolverMap: {
        Query: {
            launchesPastResult,
            launchesPastPagePaging,
        },
    },

    dependencies: {
        graphqlSchema,
    },
});

export const handlers = [rest.post("/graphql", mswResolver(graphqlHandler)), rest.get("/launches", launchesPastRest)];
