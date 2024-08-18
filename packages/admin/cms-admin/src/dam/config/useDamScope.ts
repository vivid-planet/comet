import * as React from "react";

import { DamScopeContext } from "./DamScopeContext";

function useDamScope(): Record<string, unknown> {
    const damScopeContextApi = React.useContext(DamScopeContext);
    return damScopeContextApi.damScope;
}

function useDamScopeOverride() {
    const damScopeContextApi = React.useContext(DamScopeContext);
    return damScopeContextApi.overrideDamScope;
}

export { useDamScope, useDamScopeOverride };
