import { ThemedComponentBaseProps } from "@comet/admin";
import { ComponentsOverrides, Theme } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import React from "react";

import { IControlProps } from "../../types";
import { Root, RteToolbarClassKey, Slot } from "./Toolbar.styles";

export interface RteToolbarProps
    extends IControlProps,
        ThemedComponentBaseProps<{
            root: "div";
            slot: "div";
        }> {
    children: Array<(p: IControlProps) => JSX.Element | null>;
}

export function Toolbar(inProps: RteToolbarProps) {
    const { children, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminRteToolbar" });

    const childrenElements = children
        .filter((c) => {
            const Comp = c;
            return Comp(restProps) !== null; // filter out unused control components
        })
        .map((c) => {
            const Comp = c;
            return React.createElement(Comp, restProps);
        });

    return (
        // TODO: Find alternative to className
        <Root {...slotProps?.root} {...restProps} className="CometAdminRteToolbar-root">
            {childrenElements.map((c, idx) => {
                return (
                    <Slot key={idx} {...slotProps?.slot}>
                        {c}
                    </Slot>
                );
            })}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminRteToolbar: RteToolbarProps;
    }

    interface ComponentNameToClassKey {
        CometAdminRteToolbar: RteToolbarClassKey;
    }

    interface Components {
        CometAdminRteToolbar?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminRteToolbar"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminRteToolbar"];
        };
    }
}
