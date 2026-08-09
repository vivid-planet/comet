import isEqual from "lodash.isequal";

import type { DamScopeInterface } from "./types";

export function damScopesAreEqual(scope1: DamScopeInterface | undefined, scope2: DamScopeInterface | undefined): boolean {
    // A scope can be a class instance (e.g. DamScope) or a plain object (e.g. from a GraphQL input).
    // Cloning both into plain objects makes them comparable across those two forms.
    return isEqual({ ...scope1 }, { ...scope2 });
}
