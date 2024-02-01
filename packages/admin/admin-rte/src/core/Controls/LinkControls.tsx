import { ThemedComponentBaseProps } from "@comet/admin";
import { ButtonGroup, ComponentsOverrides, css, styled, Theme, useThemeProps } from "@mui/material";
import * as React from "react";

import LinkToolbarButton from "../extension/Link/ToolbarButton";
import LinksRemoveToolbarButton from "../extension/LinksRemove/ToolbarButton";
import { IControlProps } from "../types";

export type RteLinkControlsProps = ThemedComponentBaseProps<{ root: typeof ButtonGroup; item: "div" }>;

function StyledLinkControls(p: IControlProps, inProps: RteLinkControlsProps) {
    const {
        options: { supports: supportedThings, overwriteLinkButton, overwriteLinksRemoveButton },
    } = p;

    const { slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminRteLinkControls" });

    const LinkButtonComponent = overwriteLinkButton ? overwriteLinkButton : LinkToolbarButton;
    const LinksRemoveButtonComponent = overwriteLinksRemoveButton ? overwriteLinksRemoveButton : LinksRemoveToolbarButton;

    return (
        <Root {...slotProps?.root} {...restProps}>
            <Item {...slotProps?.item}>{supportedThings.includes("link") && <LinkButtonComponent {...p} />}</Item>
            <Item {...slotProps?.item}>{supportedThings.includes("links-remove") && <LinksRemoveButtonComponent {...p} />}</Item>
        </Root>
    );
}

export type RteLinkControlsClassKey = "root" | "item";

const Root = styled(ButtonGroup, {
    name: "CometAdminRteLinkControls",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})();

const Item = styled("div", {
    name: "CometAdminRteLinkControls",
    slot: "item",
    overridesResolver(_, styles) {
        return [styles.item];
    },
})(css`
    margin-right: 1px;
    min-width: 0;
    &:last-child {
        margin-right: 0;
    }
`);

// If there are no link-actions, this must return null not just an empty component, to prevent an empty item from being rendered in Toolbar
export default (p: IControlProps) => {
    const supportedThings = p.options.supports;

    if (!supportedThings.includes("link") && !supportedThings.includes("links-remove")) {
        return null;
    }

    return <StyledLinkControls {...p} />;
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminMyComponent: RteLinkControlsProps;
    }

    interface ComponentNameToClassKey {
        CometAdminRteLinkControls: RteLinkControlsClassKey;
    }

    interface Components {
        CometAdminRteLinkControls?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminRteLinkControls"];
        };
    }
}
