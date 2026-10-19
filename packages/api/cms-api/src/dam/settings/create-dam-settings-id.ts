import { v5 } from "uuid";

import type { DamScopeInterface } from "../types";

const damSettingsIdNamespace = "c6f3b0d4-3f0e-4b7a-9a52-6a4d1f2e8b17";

export function createDamSettingsId(scope?: DamScopeInterface): string {
    const sortedScopeEntries = Object.entries(scope ?? {})
        .filter(([, value]) => value !== undefined && value !== null)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

    return v5(JSON.stringify(sortedScopeEntries), damSettingsIdNamespace);
}
