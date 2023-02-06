import * as React from "react";

import { useContentScope } from "../../contentScope/Provider";
import { DamScopeContext } from "./DamScopeContext";
import { useDamConfig } from "./useDamConfig";

function useDamScope(): Record<string, unknown> {
    const { scopeParts = [] } = useDamConfig();
    const { scope: completeScope } = useContentScope();
    const explicitDamScope = React.useContext(DamScopeContext);

    if (explicitDamScope) {
        return explicitDamScope;
    }

    return scopeParts.reduce((damScope, scope) => {
        damScope[scope] = completeScope[scope];
        return damScope;
    }, {} as { [key: string]: unknown });
}

export { useDamScope };
