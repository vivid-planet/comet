import "reflect-metadata";

import type { Type } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { createBrevoConfigResolver } from "./brevo-config.resolver";
import type { BrevoConfigInterface } from "./entities/brevo-config-entity.factory";

// Metadata key read by cms-api's UserPermissionsGuard to determine the required permission.
// It is not exported from @comet/cms-api, so it is referenced here by its stable string value.
const REQUIRED_PERMISSION_METADATA_KEY = "requiredPermission";
// Set by @nestjs/graphql's @Query/@Mutation on the method, holding the resolver type ("Query" | "Mutation").
// Used to discover a resolver's GraphQL operations so newly added ones are checked automatically.
const RESOLVER_TYPE_METADATA_KEY = "graphql:resolver_type";

type RequiredPermissionMetadata = { requiredPermission: string[]; options?: { skipScopeCheck?: boolean } };

class Scope {
    domain: string;
    language: string;
}
const BrevoConfig = class BrevoConfig {} as unknown as Type<BrevoConfigInterface>;

const BrevoConfigResolver = createBrevoConfigResolver({ Scope, BrevoConfig });

const getRequiredPermission = (target: object): RequiredPermissionMetadata | undefined =>
    Reflect.getMetadata(REQUIRED_PERMISSION_METADATA_KEY, target);

const getPrototypeMember = (resolver: object, member: string): object => (resolver as { prototype: Record<string, object> }).prototype[member];

// Discovers the resolver's GraphQL operations (queries and mutations) so newly added operations are
// covered by the scope-check assertions automatically, instead of relying on a hand-maintained list.
const getGraphQLOperations = (resolver: object): string[] => {
    const prototype = (resolver as { prototype: object }).prototype;
    return Object.getOwnPropertyNames(prototype).filter((member) => {
        if (member === "constructor") {
            return false;
        }
        const resolverType = Reflect.getMetadata(RESOLVER_TYPE_METADATA_KEY, getPrototypeMember(resolver, member));
        return resolverType === "Query" || resolverType === "Mutation";
    });
};

// Mirrors Reflector.getAllAndOverride([handler, class]) used by the guard: a method-level
// decorator overrides the class-level one.
const getEffectiveRequiredPermission = (resolver: object, operation: string): RequiredPermissionMetadata | undefined =>
    getRequiredPermission(getPrototypeMember(resolver, operation)) ?? getRequiredPermission(resolver);

// Operations that are intentionally exposed without a content-scope check. Adding an entry here is a
// deliberate security decision: the operation must be safe to call across all scopes.
const operationsExemptFromScopeCheck: string[] = [];

const configOperations = getGraphQLOperations(BrevoConfigResolver).filter((operation) => !operationsExemptFromScopeCheck.includes(operation));

describe("BrevoConfigResolver authorization", () => {
    it("requires the scope-checked brevoNewsletterConfig permission on the resolver", () => {
        const permission = getRequiredPermission(BrevoConfigResolver);
        expect(permission?.requiredPermission).toEqual(["brevoNewsletterConfig"]);
        expect(permission?.options?.skipScopeCheck ?? false).toBe(false);
    });

    it("discovers the resolver's GraphQL operations", () => {
        // Guards against the metadata key drifting and silently turning the per-operation checks
        // below into a no-op (it.each([]) passes vacuously).
        expect(configOperations.length).toBeGreaterThan(0);
    });

    it.each(configOperations)("enforces the content scope on %s", (operation) => {
        expect(getEffectiveRequiredPermission(BrevoConfigResolver, operation)?.options?.skipScopeCheck ?? false).toBe(false);
    });
});
