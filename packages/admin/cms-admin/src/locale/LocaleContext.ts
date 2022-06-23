import * as React from "react";

import { ContentScopeInterface } from "../contentScope/Provider";

export type ResolveLocaleFunction = (scope: ContentScopeInterface) => string;

export interface LocaleContext {
    resolveLocaleForScope: ResolveLocaleFunction;
}

export const LocaleContext = React.createContext<LocaleContext>({ resolveLocaleForScope: () => "en" });
