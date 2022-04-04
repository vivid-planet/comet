import { ButtonGroup, ComponentsOverrides, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import LinkToolbarButton from "../extension/Link/ToolbarButton";
import LinksRemoveToolbarButton from "../extension/LinksRemove/ToolbarButton";
import { IControlProps } from "../types";

function LinkControls(p: IControlProps & WithStyles<typeof styles>) {
    const {
        options: { supports: supportedThings, overwriteLinkButton, overwriteLinksRemoveButton },
        classes,
    } = p;

    const LinkButtonComponent = overwriteLinkButton ? overwriteLinkButton : LinkToolbarButton;
    const LinksRemoveButtonComponent = overwriteLinksRemoveButton ? overwriteLinksRemoveButton : LinksRemoveToolbarButton;

    return (
        <ButtonGroup classes={{ root: classes.root }}>
            <div className={classes.item}>{supportedThings.includes("link") && <LinkButtonComponent {...p} />}</div>
            <div className={classes.item}>{supportedThings.includes("links-remove") && <LinksRemoveButtonComponent {...p} />}</div>
        </ButtonGroup>
    );
}

export type RteLinkControlsClassKey = "root" | "item";

const styles = () => {
    return createStyles<RteLinkControlsClassKey, IControlProps>({
        root: {},
        item: {
            marginRight: 1,
            minWidth: 0,
            "&:last-child": {
                marginRight: 0,
            },
        },
    });
};

const StyledLinkControls = withStyles(styles, { name: "CometAdminRteLinkControls" })(LinkControls);

// If there are no link-actions, this must return null not just an empty component, to prevent an empty item from being rendered in Toolbar
export default (p: IControlProps) => {
    const supportedThings = p.options.supports;

    if (!supportedThings.includes("link") && !supportedThings.includes("links-remove")) {
        return null;
    }

    return <StyledLinkControls {...p} />;
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminRteLinkControls: RteLinkControlsClassKey;
    }

    interface Components {
        CometAdminRteLinkControls?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminRteLinkControls"];
        };
    }
}
