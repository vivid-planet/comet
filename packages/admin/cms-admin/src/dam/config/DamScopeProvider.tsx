import * as React from "react";

import { useContentScope } from "../../contentScope/Provider";
import { DamScopeContext } from "./DamScopeContext";
import { useDamConfig } from "./useDamConfig";

type Props = { children: React.ReactNode };

export function DamScopeProvider({ children }: Props): JSX.Element {
    const { scopeParts = [] } = useDamConfig();
    const { scope: completeScope } = useContentScope();

    const damScope = scopeParts.reduce((damScope, scope) => {
        damScope[scope] = completeScope[scope];
        return damScope;
    }, {} as Record<string, unknown>);

    return <DamScopeContext.Provider value={damScope}>{children}</DamScopeContext.Provider>;
}
