import { useContext } from "react";

import { DamScopeContext } from "./DamScopeContext";

function useDamScope(): Record<string, unknown> {
    return useContext(DamScopeContext);
}

export { useDamScope };
