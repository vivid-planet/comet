import * as React from "react";

import { useContentScope } from "../../contentScope/Provider";
import { DamScopeContext } from "./DamScopeContext";
import { useDamConfig } from "./useDamConfig";

type Props = { children: React.ReactNode; overrideScope?: Record<string, unknown> };

export function DamScopeProvider({ children, overrideScope }: Props): JSX.Element {
    const { scopeParts = [] } = useDamConfig();
    const { scope: completeScope } = useContentScope();

    const [damScope, setDamScope] = React.useState<Record<string, unknown>>({});

    React.useEffect(() => {
        const damScope = scopeParts.reduce((damScope, scope) => {
            damScope[scope] = completeScope[scope];
            return damScope;
        }, {} as Record<string, unknown>);

        setDamScope(damScope);
    }, [completeScope, scopeParts]);

    const overrideDamScope = React.useCallback((damScope: Record<string, unknown>) => {
        setDamScope(damScope);
    }, []);

    // const damScope = { domain: SHARED_DAM_SCOPE };

    return <DamScopeContext.Provider value={{ damScope: overrideScope ?? damScope, overrideDamScope }}>{children}</DamScopeContext.Provider>;
}
