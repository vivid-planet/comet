import { describe, expect, it } from "vitest";

import { createDamSettingsId } from "./create-dam-settings-id";

describe("createDamSettingsId", () => {
    it("creates the same ID regardless of the order of the scope's keys", () => {
        expect(createDamSettingsId({ domain: "main", language: "en" })).toBe(createDamSettingsId({ language: "en", domain: "main" }));
    });

    it("creates different IDs for different scopes", () => {
        expect(createDamSettingsId({ domain: "main" })).not.toBe(createDamSettingsId({ domain: "secondary" }));
    });

    it("creates the same ID for a missing and an empty scope", () => {
        expect(createDamSettingsId(undefined)).toBe(createDamSettingsId({}));
    });

    it("ignores scope parts without a value", () => {
        expect(createDamSettingsId({ domain: "main", language: undefined })).toBe(createDamSettingsId({ domain: "main" }));
    });
});
