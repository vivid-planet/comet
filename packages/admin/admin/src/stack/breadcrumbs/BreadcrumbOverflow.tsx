import { ChevronRight } from "@comet/admin-icons";
import { Link, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { WithStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

import { BreadcrumbItem } from "../Stack";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { styles } from "./StackBreadcrumbs.styles";

interface Props {
    items: BreadcrumbItem[];
}

// This must return an HTML element, as MuiBreadcrumbs cannot handle fragments.
export const BreadcrumbOverflow = ({ items, classes }: Props & WithStyles<typeof styles>): React.ReactElement => {
    const [showOverflowMenu, setShowOverflowMenu] = React.useState<boolean>(false);
    const overflowLinkRef = React.useRef<HTMLAnchorElement>(null);

    return (
        <span>
            <Link
                ref={overflowLinkRef}
                onClick={() => setShowOverflowMenu(true)}
                className={clsx(classes.link, classes.overflowLink)}
                variant="body2"
            >
                ...
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
        </span>
    );
};
