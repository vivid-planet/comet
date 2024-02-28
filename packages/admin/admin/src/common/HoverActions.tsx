import { ComponentsOverrides, css, Grow, styled, Theme, useThemeProps } from "@mui/material";
import * as React from "react";

import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export interface HoverActionsProps
    extends ThemedComponentBaseProps<{
        root: "div";
        hoverAreaExpansion: "div";
        actions: "div";
        children: "div";
    }> {
    actions?: React.ReactNode;
    children?: React.ReactNode;
}

export type HoverActionsClassKey = "root" | "hoverAreaExpansion" | "actions" | "children";

export const HoverActions = (inProps: HoverActionsProps) => {
    const { actions, children, slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminHoverActions" });
    const [isHovering, setIsHovering] = React.useState<boolean>(false);

    return (
        <Root onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)} {...slotProps?.root} {...restProps}>
            <HoverAreaExpansion {...slotProps?.hoverAreaExpansion} />
            <Grow in={Boolean(actions) && isHovering}>
                <Actions {...slotProps?.actions}>{actions}</Actions>
            </Grow>
            <Children {...slotProps?.children}>{children}</Children>
        </Root>
    );
};

const Root = styled("div", {
    name: "CometAdminHoverActions",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})();

const HoverAreaExpansion = styled("div", {
    name: "CometAdminHoverActions",
    slot: "hoverAreaExpansion",
    overridesResolver(_, styles) {
        return [styles.hoverAreaExpansion];
    },
})(
    css`
        // This element expands the root's hover area to include the parent's full size, including padding.
        // For example, when used inside a MuiTableCell, the whole cell can be hovered instead of only its text content.
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
    `,
);

const Actions = styled("div", {
    name: "CometAdminHoverActions",
    slot: "actions",
    overridesResolver(_, styles) {
        return [styles.actions];
    },
})(
    ({ theme }) => css`
        position: absolute;
        z-index: 2;
        top: 0;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: center;
        padding-left: ${theme.spacing(2)};
        padding-right: ${theme.spacing(2)};
        background-color: rgba(255, 255, 255, 0.9);
    `,
);

const Children = styled("div", {
    name: "CometAdminHoverActions",
    slot: "children",
    overridesResolver(_, styles) {
        return [styles.children];
    },
})(
    css`
        position: relative;
        z-index: 1;
    `,
);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminHoverActions: HoverActionsClassKey;
    }

    interface ComponentsPropsList {
        CometAdminHoverActions: Partial<HoverActionsProps>;
    }

    interface Components {
        CometAdminHoverActions?: {
            defaultProps?: ComponentsPropsList["CometAdminHoverActions"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminHoverActions"];
        };
    }
}
