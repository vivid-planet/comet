import { useContext } from "react";

import { type ContentScopeInterface } from "../contentScope/Provider";
import { LocaleContext } from "./LocaleContext";

interface UseLocaleOptions {
    scope: ContentScopeInterface;
}

export function useLocale({ scope }: UseLocaleOptions): string {
    const { resolveLocaleForScope } = useContext(LocaleContext);

    return resolveLocaleForScope(scope);
}
