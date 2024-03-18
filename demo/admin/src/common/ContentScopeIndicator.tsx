import { ContentScopeIndicator as ContentScopeIndicatorLibrary, ContentScopeInterface, ContentScopeValues, useContentScope } from "@comet/cms-admin";
import * as React from "react";

type Props = React.ComponentProps<typeof ContentScopeIndicatorLibrary> & {
    scope?: ContentScopeInterface;
    domainOnly?: boolean;
};

const capitalizeString = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

const findLabelForScope = (scope: string, value: string, values: ContentScopeValues) => {
    const label = values[scope].find(({ value: val }) => val === value)?.label;
    return label ?? capitalizeString(value);
};

function ContentScopeIndicator({ global, scope, domainOnly }: Props): JSX.Element {
    const { values } = useContentScope();

    if (global) {
        return <ContentScopeIndicatorLibrary global />;
    }

    if (!scope) {
        throw new Error("Missing scope object for non-global content scope indicator");
    }

    const scopes: React.ReactNode[] = [findLabelForScope("domain", scope.domain, values)];

    if (!domainOnly) {
        scopes.push(findLabelForScope("language", scope.language, values));
    }

    return <ContentScopeIndicatorLibrary scopes={scopes} />;
}

export { ContentScopeIndicator };
