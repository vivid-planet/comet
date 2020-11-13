import ButtonGroup from "@material-ui/core/ButtonGroup";
import * as React from "react";

import { ToolbarButton as LinkToolbarButton } from "../extension/Link";
import { ToolbarButton as LinksRemoveToolbarButton } from "../extension/LinksRemove";
import { IControlProps } from "../types";
import * as sc from "./LinkControls.sc";

export default function ListsControls(p: IControlProps) {
    const {
        options: { supports: supportedThings, overwriteLinkButton, overwriteLinksRemoveButton },
    } = p;

    if (!supportedThings.includes("link") && !supportedThings.includes("links-remove")) {
        return null;
    }

    const LinkButtonComponent = overwriteLinkButton ? overwriteLinkButton : LinkToolbarButton;
    const LinksRemoveButtonComponent = overwriteLinksRemoveButton ? overwriteLinksRemoveButton : LinksRemoveToolbarButton;

    return (
        <ButtonGroup>
            <sc.ButtonWrapper>{supportedThings.includes("link") && <LinkButtonComponent {...p} />}</sc.ButtonWrapper>
            <sc.ButtonWrapper>{supportedThings.includes("links-remove") && <LinksRemoveButtonComponent {...p} />}</sc.ButtonWrapper>
        </ButtonGroup>
    );
}
