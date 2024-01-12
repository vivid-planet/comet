import { ComponentsOverrides, css, styled, Theme, useThemeProps } from "@mui/material/styles";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */

export type FilterBarClassKey = "root" | "barWrapper";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */

const Root = styled("div", {
    name: "CometAdminFilterBar",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(css`
    & [class*="CometAdminFormFieldContainer-root"] {
        margin-bottom: 0;
    }
`);

const BarWrapper = styled("div", {
    name: "CometAdminFilterBar",
    slot: "barWrapper",
    overridesResolver(_, styles) {
        return [styles.barWrapper];
    },
})(css`
    flex-wrap: wrap;
    display: flex;
`);

export interface FilterBarProps
    extends ThemedComponentBaseProps<{
        root: "div";
        barWrapper: "div";
    }> {
    children?: React.ReactNode;
}

export function FilterBar(inProps: FilterBarProps) {
    const { children, slotProps, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminFilterBar",
    });

    return (
        <Root {...slotProps?.root} {...restProps}>
            <BarWrapper {...slotProps?.barWrapper}>{children}</BarWrapper>
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminFilterBar: FilterBarClassKey;
    }

    interface ComponentsPropsList {
        CometAdminFilterBar: Partial<FilterBarProps>;
    }

    interface Components {
        CometAdminFilterBar?: {
            defaultProps?: ComponentsPropsList["CometAdminFilterBar"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBar"];
        };
    }
}
