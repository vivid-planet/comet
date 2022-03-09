/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any */
import { gql } from "@apollo/client";

export function buildUpdateRestMutation(options: { type: string; path: string; responseFragment: any }) {
    const { type, path, responseFragment } = options;
    const fragmentName = responseFragment.definitions[0].name.value; // probably not ideal, only works for a single fragment
    return gql`
        mutation update($id: ID!, $body: ${type}UpdateInput!) {
        update(id: $id, body: $body) @rest(type: "${type}", path: "${path}", method: "PUT", bodyKey: "body") {
            ...${fragmentName}
        }
        }
        ${responseFragment}
    `;
}

export function buildCreateRestMutation(options: { type: string; path: string; responseFragment: any }) {
    const { type, path, responseFragment } = options;
    const fragmentName = responseFragment.definitions[0].name.value; // probably not ideal, only works for a single fragment
    return gql`
        mutation create($body: ${type}UpdateInput!) {
        create(body: $body) @rest(type: "${type}", path: "${path}", method: "POST", bodyKey: "body") {
            ...${fragmentName}
        }
        }
        ${responseFragment}
    `;
}

export function buildDeleteRestMutation(options: { path: string }) {
    const { path } = options;
    return gql`
        mutation delete($id: ID!) {
        delete(id: $id) @rest(type: "NoRealTypeButOneNeeded", path: "${path}", method: "DELETE") {
            id
        }
        }
    `;
}
