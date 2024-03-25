import { SvgIconProps } from "@mui/material";
import React from "react";

import { capitalizeString, combineObjects } from "./ContentScope.utils";
import { ContentScopeInterface, ContentScopeValues, useContentScope } from "./Provider";
import ContentScopeSelect from "./Select";

export type ContentScopeControlsConfig<S extends ContentScopeInterface = ContentScopeInterface> = {
    [P in keyof S]?: {
        label?: string;
        icon?:
            | React.ComponentType<SvgIconProps>
            | React.ForwardRefExoticComponent<React.PropsWithoutRef<SvgIconProps> & React.RefAttributes<SVGSVGElement>>;
        searchable?: boolean;
    };
};

interface ContentScopeControlsProps<S extends ContentScopeInterface = ContentScopeInterface> {
    config?: ContentScopeControlsConfig<S>; // form configuration
}

export type ContentScopeCombinations = {
    mapping: string[];
    grouping?: ContentScopeInterface;
    values: ContentScopeInterface[] | ContentScopeInterface[][];
}[];

// A standard control form for scope
// Can be easily configured (should fit for 90% of all cases)
export function ContentScopeControls<S extends ContentScopeInterface = ContentScopeInterface>({
    config = {},
}: ContentScopeControlsProps<S>): JSX.Element {
    const { scope, setScope, values } = useContentScope<S>();
    const findLabelForScopePart = (scopePart: keyof ContentScopeInterface) => {
        const label = values[scopePart].find(({ value }) => value === scope[scopePart])?.label;
        return label ?? capitalizeString(scope[scopePart]);
    };

    const label = Object.keys(scope)
        .map((scopeKey: string) => findLabelForScopePart(scopeKey))
        .join(" / ");

    const createScopeCombinations = (scopeValues: ContentScopeValues<S>): ContentScopeCombinations => {
        const [groupDim, ...restDim] = Object.keys(scopeValues).map((scope: string) =>
            scopeValues[scope].map(({ value, label }: ContentScopeInterface) => ({
                value,
                label,
            })),
        );
        if (Object.keys(scopeValues).length == 1) {
            return groupDim.map((grouping) => ({
                mapping: Object.keys(scopeValues),
                values: [grouping],
            }));
        }

        return groupDim.map((grouping) => ({
            mapping: Object.keys(scopeValues),
            grouping,
            values: combineObjects(restDim),
        }));
    };

    const scopeCombinations = createScopeCombinations(values);

    return (
        <ContentScopeSelect
            label={label}
            icon={config.domain?.icon}
            searchable={config.domain?.searchable}
            value={scope}
            values={scopeCombinations}
            onChange={(selectedScopes: ContentScopeInterface[], mapping: Array<keyof ContentScopeValues>) => {
                setScope((s) => {
                    const scope = {
                        ...s,
                        ...mapping.reduce((result: { [key: string]: string }, mappedKey, index) => {
                            result[mappedKey] = selectedScopes[index].value;
                            return result;
                        }, {}),
                    };
                    return scope;
                });
            }}
        />
    );
}
