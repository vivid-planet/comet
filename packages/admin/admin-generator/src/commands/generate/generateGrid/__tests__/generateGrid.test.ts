import { buildSchema, type GraphQLSchema, introspectionFromSchema, type IntrospectionQuery } from "graphql";

import { type GridConfig } from "../../generate-command";
import { generateGrid } from "../generateGrid";

describe("generateGrid", () => {
    let schema: GraphQLSchema;
    let introspection: IntrospectionQuery;

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
                booksByAuthor(
                    authorId: ID!
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

        introspection = introspectionFromSchema(schema);
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

    it("should generate required root gql args in export-query variables", () => {
        const config: GridConfig<Book> = {
            type: "grid",
            gqlType: "Book",
            query: "booksByAuthor",
            excelExport: true,
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
