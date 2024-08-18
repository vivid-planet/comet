import * as React from "react";

export const DamScopeContext = React.createContext<DamScopeContextApi>({
    damScope: {},
    overrideDamScope: () => {},
});

interface DamScopeContextApi {
    damScope: Record<string, unknown>;
    overrideDamScope: (damScope: Record<string, unknown>) => void;
}
