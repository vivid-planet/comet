import * as React from "react";

import { LocaleContext, ResolveLocaleFunction } from "./LocaleContext";

interface Props {
    resolveLocaleForScope: ResolveLocaleFunction;
    children: React.ReactNode;
}

export function LocaleProvider({ resolveLocaleForScope, children }: Props): React.ReactElement {
    return <LocaleContext.Provider value={{ resolveLocaleForScope }}>{children}</LocaleContext.Provider>;
}
