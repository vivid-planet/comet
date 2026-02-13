import { faker } from "@faker-js/faker";
import { mswResolver } from "@graphql-mocks/network-msw";
import { type GraphQLFieldResolver } from "graphql";
import { GraphQLHandler } from "graphql-mocks";
import { http } from "msw";

export type Manufacturer = {
    id: string;
    name: string;
};

const allManufacturers: Manufacturer[] = [];

for (let i = 0; i < 10; i += 1) {
    allManufacturers.push({
        id: faker.string.uuid(),
        name: faker.company.name(),
    });
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const graphqlSchema = `
schema {
  query: Query
}

type Manufacturer {
    id: ID!
    name: String!
}

type Query {
    manufacturers(search: String): [Manufacturer!]!
}
`;

const manufacturers: GraphQLFieldResolver<unknown, unknown> = async (source, args, context, info) => {
    await sleep(500);
    return allManufacturers.filter((manufacturer) => {
        return !args.search || manufacturer.name.toLowerCase().includes(args.search.toLowerCase());
    });
};

const graphqlHandler = new GraphQLHandler({
    resolverMap: {
        Query: {
            manufacturers,
        },
    },

    dependencies: {
        graphqlSchema,
    },
});

export const handlers = [http.post("/graphql", mswResolver(graphqlHandler))];
