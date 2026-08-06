import isEqual from "lodash.isequal";

import type { DamScopeInterface } from "../types";

// The scopes are cloned because they could be an instance of a class (e.g. DamScope) or a plain object (from an HTTP/GraphQL input).
// Without cloning they wouldn't be deeply equal although they represent the same scope.
export function scopesAreEqual(scope1?: DamScopeInterface, scope2?: DamScopeInterface): boolean {
    return isEqual({ ...scope1 }, { ...scope2 });
}
