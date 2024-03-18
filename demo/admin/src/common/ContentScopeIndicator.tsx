import { ContentScopeIndicator as ContentScopeIndicatorLibrary, useContentScope } from "@comet/cms-admin";
import { ContentScope } from "@src/common/ContentScopeProvider";
import * as React from "react";

type Props = React.ComponentProps<typeof ContentScopeIndicatorLibrary> & {
    scope?: ContentScope;
    domainOnly?: boolean;
};

const capitalizeString = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function ContentScopeIndicator({ global, scope, domainOnly }: Props): JSX.Element {
    const { values } = useContentScope();

    if (global) {
        return <ContentScopeIndicatorLibrary global />;
    }

    if (!scope) {
        throw new Error("Missing scope object for non-global content scope indicator");
    }

    const findLabelForScopePart = (scopePart: keyof ContentScope) => {
        const label = values[scopePart].find(({ value }) => value === scope[scopePart])?.label;
        return label ?? capitalizeString(scope[scopePart]);
    };

    const scopeLabels: React.ReactNode[] = [findLabelForScopePart("domain")];

    if (!domainOnly) {
        scopeLabels.push(findLabelForScopePart("language"));
    }

    return <ContentScopeIndicatorLibrary scopeLabels={scopeLabels} />;
}

export { ContentScopeIndicator };
