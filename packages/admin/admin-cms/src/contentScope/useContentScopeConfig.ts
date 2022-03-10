import React from "react";

import { useContentScope } from "./Provider";

export interface ContentScopeConfigProps {
    redirectPathAfterChange?: string;
}

export function useContentScopeConfig({ redirectPathAfterChange }: ContentScopeConfigProps): void {
    const { setRedirectPathAfterChange } = useContentScope();

    React.useEffect(() => {
        setRedirectPathAfterChange(redirectPathAfterChange);
        return () => {
            setRedirectPathAfterChange(undefined);
        };
    }, [setRedirectPathAfterChange, redirectPathAfterChange]);
}
