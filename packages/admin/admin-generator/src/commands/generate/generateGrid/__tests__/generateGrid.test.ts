import { buildSchema, getIntrospectionQuery, type GraphQLSchema, graphqlSync } from "graphql";

import { type GridConfig } from "../../generate-command";
import { generateGrid } from "../generateGrid";

describe("generateGrid", () => {
    let schema: GraphQLSchema;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let introspection: any;

    beforeAll(() => {
        schema = buildSchema(`
            input StringFilter {
                equal: String
            }

            type Query {
                books(
                    offset: Int!
                    limit: Int!
                    sort: [BookSort!]
                    filter: BookFilter
                ): PaginatedBooks!
            } 

            type PaginatedBooks {
                nodes: [Book!]!
                totalCount: Int!
            }

            type Book {
                id: ID!
                title: String!
            }

            input BookFilter {
                title: StringFilter
            }

            input BookSort {
                field: BookSortField!
                direction: SortDirection!
            }

            enum BookSortField {
                title
            }

            enum SortDirection {
                ASC
                DESC
            }

            type Mutation {
                createBook(input: BookInput!): Book!
                updateBook(id: ID!, input: BookInput!): Book!
                deleteBook(id: ID!): Boolean!
            }

            input BookInput {
                title: String!
            }
        `);

        const result = graphqlSync({
            schema,
            source: getIntrospectionQuery(),
        });

        if (result.errors || !result.data) {
            throw new Error("Failed to generate introspection");
        }

        introspection = result.data;
    });

    type Book = {
        __typename: "Book";
        id: string;
        title: string;
    };

    it("should generate a grid with book configuration", () => {
        const config: GridConfig<Book> = {
            type: "grid",
            gqlType: "Book",
            columns: [
                {
                    type: "text",
                    name: "title",
                },
            ],
        };

        const result = generateGrid(
            {
                exportName: "BooksGrid",
                baseOutputFilename: "BooksGrid",
                targetDirectory: "/test",
                gqlIntrospection: introspection,
            },
            config,
        );

        expect(result.code).toMatchSnapshot();
    });
});
