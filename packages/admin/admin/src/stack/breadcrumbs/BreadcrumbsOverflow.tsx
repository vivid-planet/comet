import { ChevronRight } from "@comet/admin-icons";
import { Link, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { WithStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

import { BreadcrumbItem } from "../Stack";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { styles } from "./StackBreadcrumbs.styles";

interface BreadcrumbsOverflowProps {
    items: BreadcrumbItem[];
    linkText: React.ReactNode;
}

export const BreadcrumbsOverflow = ({ items, linkText, classes }: BreadcrumbsOverflowProps & WithStyles<typeof styles>): React.ReactElement => {
    const [showOverflowMenu, setShowOverflowMenu] = React.useState<boolean>(false);
    const overflowLinkRef = React.useRef<HTMLAnchorElement>(null);

    return (
        <>
            <Link
                ref={overflowLinkRef}
                className={clsx(classes.link, classes.overflowLink)}
                onClick={() => setShowOverflowMenu(true)}
                variant="body2"
            >
                {linkText}
            </Link>
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
