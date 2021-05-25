import { makeStyles } from "@material-ui/core";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

import LinkToolbarButton from "../extension/Link/ToolbarButton";
import LinksRemoveToolbarButton from "../extension/LinksRemove/ToolbarButton";
import { IControlProps } from "../types";

function LinkControls(p: IControlProps) {
    const {
        options: { supports: supportedThings, overwriteLinkButton, overwriteLinksRemoveButton },
    } = p;
    const classes = useStyles();

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

const useStyles = makeStyles<Theme, {}, CometAdminRteLinkControlsClassKeys>(
    () => {
        return {
            root: {},
            item: {
                marginRight: 1,
                minWidth: 0,
                "&:last-child": {
                    marginRight: 0,
                },
            },
        };
    },
    { name: "CometAdminRteLinkControls" },
);

const StyledLinkControls = LinkControls;

// If there are no link-actions, this must return null not just an empty component, to prevent an empty item from being rendered in Toolbar
export default (p: IControlProps) => {
    const supportedThings = p.options.supports;

    if (!supportedThings.includes("link") && !supportedThings.includes("links-remove")) {
        return null;
    }

    return <StyledLinkControls {...p} />;
};
