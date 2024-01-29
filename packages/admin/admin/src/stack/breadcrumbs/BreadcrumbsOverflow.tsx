import { ChevronRight } from "@comet/admin-icons";
import { Link, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { css, styled } from "@mui/material/styles";
import * as React from "react";

import { BreadcrumbItem } from "../Stack";
import { BreadcrumbLink } from "./BreadcrumbLink";

export interface BreadcrumbsOverflowProps {
    items: BreadcrumbItem[];
    linkText: React.ReactNode;
    slotProps: any;
}

const StyledOverflowLink = styled(Link, {
    name: "CometAdminStackBreadcrumbs",
    slot: "overflowLink",
    overridesResolver(_, styles) {
        return [styles.link, styles.overflowLink];
    },
})(
    ({ theme }) => css`
        font-size: 13px;
        line-height: 14px;
        font-weight: ${theme.typography.fontWeightMedium};
        color: ${theme.palette.grey[600]};
        text-decoration-color: currentColor;
        cursor: pointer;
        padding-top: 12px;
        padding-bottom: 12px;
    `,
);

export const BreadcrumbsOverflow = ({ items, linkText, slotProps }: BreadcrumbsOverflowProps): React.ReactElement => {
    const [showOverflowMenu, setShowOverflowMenu] = React.useState<boolean>(false);
    const overflowLinkRef = React.useRef<HTMLAnchorElement>(null);

    return (
        <>
            <StyledOverflowLink ref={overflowLinkRef} {...slotProps?.overflowLink} onClick={() => setShowOverflowMenu(true)} variant="body2">
                {linkText}
            </StyledOverflowLink>
            <Menu open={showOverflowMenu} onClose={() => setShowOverflowMenu(false)} anchorEl={overflowLinkRef.current}>
                {items.map(({ id, url, title }) => (
                    <MenuItem key={id} component={BreadcrumbLink} to={url} onClick={() => setShowOverflowMenu(false)}>
                        <ListItemIcon>
                            <ChevronRight />
                        </ListItemIcon>
                        <ListItemText primary={title} />
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
