import { ReactNode } from "react";

import { useContentScope } from "../../contentScope/Provider";
import { DamScopeContext } from "./DamScopeContext";
import { useDamConfig } from "./useDamConfig";

export function DamScopeProvider({ children }: { children?: ReactNode }) {
    const { scopeParts = [] } = useDamConfig();
    const { scope: completeScope } = useContentScope();

    const damScope = scopeParts.reduce((damScope, scope) => {
        if (completeScope[scope] !== undefined) {
            damScope[scope] = completeScope[scope];
        }
        return damScope;
    }, {} as Record<string, unknown>);

    return <DamScopeContext.Provider value={damScope}>{children}</DamScopeContext.Provider>;
}
