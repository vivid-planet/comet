import { type PropsWithChildren } from "react";

import { LocaleContext, type ResolveLocaleFunction } from "./LocaleContext";

interface Props {
    resolveLocaleForScope: ResolveLocaleFunction;
}

export function LocaleProvider({ resolveLocaleForScope, children }: PropsWithChildren<Props>) {
    return <LocaleContext.Provider value={{ resolveLocaleForScope }}>{children}</LocaleContext.Provider>;
}
