import { createContext } from "react";

import { type ContentScopeInterface } from "../contentScope/Provider";

export type ResolveLocaleFunction = (scope: ContentScopeInterface) => string;

export interface LocaleContext {
    resolveLocaleForScope: ResolveLocaleFunction;
}

export const LocaleContext = createContext<LocaleContext>({ resolveLocaleForScope: () => "en" });
