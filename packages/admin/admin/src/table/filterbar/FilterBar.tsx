import { ComponentsOverrides, css, Theme, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { createSlot } from "../../helpers/createSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export type FilterBarClassKey = "root" | "barWrapper";

const Root = createSlot("div")<FilterBarClassKey>({
    componentName: "FilterBar",
    slotName: "root",
})(css`
    .CometAdminFormFieldContainer-root {
        margin-bottom: 0;
    }
`);

const BarWrapper = createSlot("div")<FilterBarClassKey>({
    componentName: "FilterBar",
    slotName: "barWrapper",
})(css`
    flex-wrap: wrap;
    display: flex;
`);

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
export interface FilterBarProps
    extends ThemedComponentBaseProps<{
        root: "div";
        barWrapper: "div";
    }> {
    children?: React.ReactNode;
}

/**
 * @deprecated Use MUI X Data Grid in combination with `useDataGridRemote` instead.
 */
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
        CometAdminFilterBar: FilterBarProps;
    }

    interface Components {
        CometAdminFilterBar?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFilterBar"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFilterBar"];
        };
    }
}
