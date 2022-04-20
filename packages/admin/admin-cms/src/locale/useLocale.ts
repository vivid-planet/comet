import * as React from "react";

import { ContentScopeInterface } from "../contentScope/Provider";
import { LocaleContext } from "./LocaleContext";

interface UseLocaleOptions {
    scope: ContentScopeInterface;
}

export function useLocale({ scope }: UseLocaleOptions): string {
    const { resolveLocaleForScope } = React.useContext(LocaleContext);

    return resolveLocaleForScope(scope);
}
