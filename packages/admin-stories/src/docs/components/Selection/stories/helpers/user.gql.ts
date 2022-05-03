import { gql } from "@apollo/client";

const gqlRest = gql;

export const usersQuery = gqlRest`
query users {
    users @rest(type: "User", path: "users") {
        id
        name
        username
        email
    }
}
`;

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
}

export interface UserQueryData {
    users: User[];
}
