import { type ReactNode } from "react";

import { useContentScope } from "../../contentScope/Provider";
import { useDamConfig } from "./damConfig";
import { DamScopeContext } from "./DamScopeContext";

export function DamScopeProvider({ children }: { children?: ReactNode }) {
    const { scopeParts = [] } = useDamConfig();
    const { scope: completeScope } = useContentScope();

    const damScope = scopeParts.reduce(
        (damScope, scope) => {
            if (completeScope[scope] !== undefined) {
                damScope[scope] = completeScope[scope];
            }
            return damScope;
        },
        {} as Record<string, unknown>,
    );

    return <DamScopeContext.Provider value={damScope}>{children}</DamScopeContext.Provider>;
}
