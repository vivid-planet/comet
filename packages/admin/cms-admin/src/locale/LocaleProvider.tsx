import { PropsWithChildren } from "react";

import { LocaleContext, ResolveLocaleFunction } from "./LocaleContext";

interface Props {
    resolveLocaleForScope: ResolveLocaleFunction;
}

export function LocaleProvider({ resolveLocaleForScope, children }: PropsWithChildren<Props>) {
    return <LocaleContext.Provider value={{ resolveLocaleForScope }}>{children}</LocaleContext.Provider>;
}
