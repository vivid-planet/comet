import * as React from "react";

import { DamScopeContext } from "./DamScopeContext";

function useDamScope(): Record<string, unknown> {
    return React.useContext(DamScopeContext);
}

export { useDamScope };
