import { gql } from "@apollo/client";

export const bookFormFragment = gql`
    fragment BookForm on Book {
        title
        description
        isAvailable
        releaseDate
        price
        publisher
        coverImage
        link
    }
`;

export const bookFormQuery = gql`
    query BookForm($id: ID!) {
        book(id: $id) {
            id
            updatedAt
            ...BookForm
        }
    }
    ${bookFormFragment}
`;

export const bookFormCheckForChangesQuery = gql`
    query BookFormCheckForChanges($id: ID!) {
        book(id: $id) {
            updatedAt
        }
    }
`;

export const createBookMutation = gql`
    mutation CreateBook($input: BookInput!) {
        createBook(input: $input) {
            id
            updatedAt
            ...BookForm
        }
    }
    ${bookFormFragment}
`;

export const updateBookMutation = gql`
    mutation UpdateBook($id: ID!, $input: BookUpdateInput!, $lastUpdatedAt: DateTime) {
        updateBook(id: $id, input: $input, lastUpdatedAt: $lastUpdatedAt) {
            id
            updatedAt
            ...BookForm
        }
    }
    ${bookFormFragment}
`;
