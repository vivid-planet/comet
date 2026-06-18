import "reflect-metadata";

import type { Type } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import type { TargetGroupInterface } from "../target-group/entity/target-group-entity.factory";
import { createBrevoContactResolver } from "./brevo-contact.resolver";
import { createBrevoContactImportResolver } from "./brevo-contact-import.resolver";
import { BrevoContactFactory } from "./dto/brevo-contact.factory";
import { BrevoContactInputFactory } from "./dto/brevo-contact-input.factory";
import { BrevoTestContactInputFactory } from "./dto/brevo-test-contact-input.factory";
import { SubscribeInputFactory } from "./dto/subscribe-input.factory";

// Metadata keys read by cms-api's UserPermissionsGuard / ContentScopeService to determine the
// required permission and the affected content scope. They are not exported from @comet/cms-api,
// so they are referenced here by their stable string values.
const REQUIRED_PERMISSION_METADATA_KEY = "requiredPermission";
const AFFECTED_ENTITY_METADATA_KEY = "affectedEntities";
// Set by @nestjs/graphql's @Query/@Mutation on the method, holding the resolver type ("Query" | "Mutation").
// Used to discover a resolver's GraphQL operations so newly added ones are checked automatically.
const RESOLVER_TYPE_METADATA_KEY = "graphql:resolver_type";

class Scope {
    domain: string;
    language: string;
}
const BrevoTargetGroup = class BrevoTargetGroup {} as unknown as Type<TargetGroupInterface>;

const BrevoContact = BrevoContactFactory.create({});
const BrevoContactSubscribeInput = SubscribeInputFactory.create({ Scope });
const [BrevoContactInput, BrevoContactUpdateInput] = BrevoContactInputFactory.create({ Scope });
const [BrevoTestContactInput] = BrevoTestContactInputFactory.create({ Scope });

const BrevoContactResolver = createBrevoContactResolver({
    BrevoContact,
    BrevoContactSubscribeInput,
    Scope,
    BrevoContactInput,
    BrevoContactUpdateInput,
    BrevoTestContactInput,
    BrevoTargetGroup,
});

const BrevoContactImportResolver = createBrevoContactImportResolver({ Scope, BrevoContact });

type RequiredPermissionMetadata = { requiredPermission: string[]; options?: { skipScopeCheck?: boolean } };

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

const expectScopeCheckEnforced = (permission: RequiredPermissionMetadata | undefined) => {
    expect(permission?.requiredPermission).toEqual(["brevoNewsletter"]);
    expect(permission?.options?.skipScopeCheck ?? false).toBe(false);
};

// Operations that are intentionally exposed without a content-scope check. Adding an entry here is a
// deliberate security decision: the operation must be safe to call across all scopes.
const operationsExemptFromScopeCheck: string[] = [];

const contactOperations = getGraphQLOperations(BrevoContactResolver).filter((operation) => !operationsExemptFromScopeCheck.includes(operation));

describe("BrevoContactResolver authorization", () => {
    it("requires the scope-checked brevoNewsletter permission on the resolver", () => {
        expectScopeCheckEnforced(getRequiredPermission(BrevoContactResolver));
    });

    it("discovers the resolver's GraphQL operations", () => {
        // Guards against the metadata key drifting and silently turning the per-operation checks
        // below into a no-op (it.each([]) passes vacuously).
        expect(contactOperations.length).toBeGreaterThan(0);
    });

    it.each(contactOperations)("enforces the content scope on %s", (operation) => {
        expectScopeCheckEnforced(getEffectiveRequiredPermission(BrevoContactResolver, operation));
    });

    it("resolves the content scope of manuallyAssignedBrevoContacts from its target group", () => {
        // manuallyAssignedBrevoContacts has no scope argument, so the scope must be resolved from the
        // referenced target group for the guard to be able to enforce it.
        const affectedEntities = Reflect.getMetadata(
            AFFECTED_ENTITY_METADATA_KEY,
            getPrototypeMember(BrevoContactResolver, "manuallyAssignedBrevoContacts"),
        );
        expect(affectedEntities).toHaveLength(1);
        expect(affectedEntities[0].entity).toBe(BrevoTargetGroup);
        expect(affectedEntities[0].options.idArg).toBe("targetGroupId");
    });
});

describe("BrevoContactImportResolver authorization", () => {
    const importOperations = getGraphQLOperations(BrevoContactImportResolver);

    it("discovers the resolver's GraphQL operations", () => {
        expect(importOperations.length).toBeGreaterThan(0);
    });

    it.each(importOperations)("enforces the content scope on %s", (operation) => {
        expectScopeCheckEnforced(getEffectiveRequiredPermission(BrevoContactImportResolver, operation));
    });
});
