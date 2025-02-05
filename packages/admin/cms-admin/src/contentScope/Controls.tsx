import { type ReactNode } from "react";

import { ContentScopeSelect } from "./ContentScopeSelect";
import { type ContentScopeInterface, useContentScope } from "./Provider";

interface ContentScopeControlsProps<Value extends ContentScopeInterface> {
    searchable?: boolean;
    groupBy?: keyof Value;
    icon?: ReactNode;
}

// A standard control form for scope
// Can be easily configured (should fit for 90% of all cases)
export function ContentScopeControls<S extends ContentScopeInterface = ContentScopeInterface>({
    searchable = true,
    icon,
    groupBy,
}: ContentScopeControlsProps<S>): JSX.Element {
    const { scope, setScope, values } = useContentScope<S>();
    return (
        <ContentScopeSelect
            value={scope}
            onChange={(value) => setScope(() => value)}
            options={values}
            searchable={searchable}
            icon={icon}
            groupBy={groupBy ?? Object.keys(scope)[0]}
        />
    );
}
