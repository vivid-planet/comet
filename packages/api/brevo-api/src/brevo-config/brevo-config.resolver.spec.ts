import "reflect-metadata";

import type { Type } from "@nestjs/common";
import { describe, expect, it } from "vitest";

import { createBrevoConfigResolver } from "./brevo-config.resolver";
import type { BrevoConfigInterface } from "./entities/brevo-config-entity.factory";

// Metadata key read by cms-api's UserPermissionsGuard to determine the required permission.
// It is not exported from @comet/cms-api, so it is referenced here by its stable string value.
const REQUIRED_PERMISSION_METADATA_KEY = "requiredPermission";

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

// Mirrors Reflector.getAllAndOverride([handler, class]) used by the guard: a method-level
// decorator overrides the class-level one.
const getEffectiveRequiredPermission = (resolver: object, operation: string): RequiredPermissionMetadata | undefined =>
    getRequiredPermission(getPrototypeMember(resolver, operation)) ?? getRequiredPermission(resolver);

const configOperations = [
    "brevoSenders",
    "brevoDoubleOptInTemplates",
    "isBrevoConfigDefined",
    "brevoConfig",
    "createBrevoConfig",
    "updateBrevoConfig",
];

describe("BrevoConfigResolver authorization", () => {
    it("requires the scope-checked brevoNewsletterConfig permission on the resolver", () => {
        const permission = getRequiredPermission(BrevoConfigResolver);
        expect(permission?.requiredPermission).toEqual(["brevoNewsletterConfig"]);
        expect(permission?.options?.skipScopeCheck ?? false).toBe(false);
    });

    it.each(configOperations)("enforces the content scope on %s", (operation) => {
        expect(getEffectiveRequiredPermission(BrevoConfigResolver, operation)?.options?.skipScopeCheck ?? false).toBe(false);
    });
});
