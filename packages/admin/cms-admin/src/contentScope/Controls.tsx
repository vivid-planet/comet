import { SvgIconProps } from "@mui/material";
import React, { useMemo } from "react";

import { ContentScopeInterface, useContentScope } from "./Provider";
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

// A standard control form for scope
// Can be easily configured (should fit for 90% of all cases)
export function ContentScopeControls<S extends ContentScopeInterface = ContentScopeInterface>({
    config = {},
}: ContentScopeControlsProps<S>): JSX.Element {
    const { scope, setScope, values } = useContentScope<S>();
    const findLabelForScopePart = (scopePart: keyof ContentScopeInterface) => {
        const label = values.find(({ value }) => value === scope[scopePart])?.label;
        return label ?? capitalizeString(scope[scopePart]);
    };

    const label = Object.keys(scope)
        .map((scopeKey: string) => findLabelForScopePart(scopeKey))
        .join(" / ");

    const groupedScopes = useMemo(() => {
        const groupingKey = Object.keys(values[0])[0];
        const groupedValues: { [key: string]: Array<ContentScopeInterface> } = {};
        values.forEach((value) => {
            if (!groupedValues[value[groupingKey].value]) {
                groupedValues[value[groupingKey].value] = [];
            }
            groupedValues[value[groupingKey].value].push(value);
        });

        return Object.keys(groupedValues).map((group, index) => ({
            group: groupedValues[group][0][groupingKey],
            groupKey: groupingKey,
            values: groupedValues[group],
        }));
    }, [values]);

    return (
        <ContentScopeSelect
            label={label}
            icon={config.domain?.icon}
            searchable={config.domain?.searchable}
            value={scope}
            values={groupedScopes}
            onChange={(selectedScope: ContentScopeInterface) => {
                setScope((s) => {
                    return {
                        ...s,
                        ...Object.keys(selectedScope).reduce((result: ContentScopeInterface, key) => {
                            result[key] = selectedScope[key].value;
                            return result;
                        }, {}),
                    };
                });
            }}
        />
    );
}

const capitalizeString = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
