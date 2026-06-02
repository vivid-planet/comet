import { GraphQLClient } from "graphql-request";

// TODO:
// This authentication method is not PRODUCTION ready and needs to be replaced by a user based authentication method. It
// is only intended for development and testing purposes.
//
// The system user has full access to the API.
const API_URL = process.env.API_URL ?? "http://localhost:4000";
const API_PASSWORD = process.env.API_BASIC_AUTH_SYSTEM_USER_PASSWORD ?? "aPasswordWith16Characters";
const AUTH_HEADER = `Basic ${Buffer.from(`system-user:${API_PASSWORD}`).toString("base64")}`;

export const client = new GraphQLClient(`${API_URL}/api/graphql`, {
    headers: {
        Authorization: AUTH_HEADER,
    },
});
