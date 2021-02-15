import { createStyles, WithStyles } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { withStyles } from "@material-ui/styles";
import * as React from "react";

import { ToolbarButton as LinkToolbarButton } from "../extension/Link";
import { ToolbarButton as LinksRemoveToolbarButton } from "../extension/LinksRemove";
import { IControlProps } from "../types";

function LinkControls(p: IControlProps & WithStyles<typeof styles>) {
    const {
        classes,
        options: { supports: supportedThings, overwriteLinkButton, overwriteLinksRemoveButton },
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

export type CometAdminRteLinkControlsClassKeys = "root" | "item";

export const styles = () =>
    createStyles<CometAdminRteLinkControlsClassKeys, any>({
        root: {},
        item: {
            marginRight: 1,
            minWidth: 0,
            "&:last-child": {
                marginRight: 0,
            },
        },
    });

const StyledLinkControls = withStyles(styles, { name: "CometAdminRteLinkControls" })(LinkControls);

// If there are no link-actions, this must return null not just an empty component, to prevent an empty item from being rendered in Toolbar
export default (p: IControlProps) => {
    const supportedThings = p.options.supports;

    if (!supportedThings.includes("link") && !supportedThings.includes("links-remove")) {
        return null;
    }

    return <StyledLinkControls {...p} />;
};
