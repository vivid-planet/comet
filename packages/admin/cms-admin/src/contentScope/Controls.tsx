import { SvgIconProps } from "@mui/material";
import React from "react";

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
    return (
        <>
            {Object.keys(values).map((key) => {
                const valuesForKey = values[key];
                const value = valuesForKey.find((c) => c.value === scope[key]);
                return value ? (
                    <ContentScopeSelect
                        key={key}
                        defaultLabel={config[key]?.label}
                        icon={config[key]?.icon}
                        searchable={config[key]?.searchable}
                        values={valuesForKey}
                        value={value}
                        onChange={(newValue) => {
                            setScope((s) => ({
                                ...s,
                                [key]: newValue,
                            }));
                        }}
                    />
                ) : null;
            })}
        </>
    );
}
