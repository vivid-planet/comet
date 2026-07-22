import isEqual from "lodash.isequal";

import type { DamScopeInterface } from "./types";

export function damScopesAreEqual(scope1: DamScopeInterface | undefined, scope2: DamScopeInterface | undefined): boolean {
    // The scopes are cloned because they could be
    //   - an instance of a class (e.g. DamScope)
    //   - or a plain object (from a GraphQL input)
    // Then they are not deeply equal, although they represent the same scope
    return isEqual({ ...scope1 }, { ...scope2 });
}
