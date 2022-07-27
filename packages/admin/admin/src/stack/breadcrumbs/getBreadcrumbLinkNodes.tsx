import { LevelUp } from "@comet/admin-icons";
import { ClassNameMap, IconButton, Link, Typography } from "@mui/material";
import { ClassKeyOfStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

import { BreadcrumbItem } from "../Stack";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { StackBreadcrumbsClassKey } from "./StackBreadcrumbs.styles";

// This must return an array of nodes, as MuiBreadcrumbs cannot handle fragments.
export const getBreadcrumbLinkNodes = (
    items: BreadcrumbItem[],
    preventLinkOnLastItem: boolean,
    classes: ClassNameMap<ClassKeyOfStyles<StackBreadcrumbsClassKey>>,
    backButtonUrl?: string,
): React.ReactNode[] =>
    items.map(({ id, url, title }, index) => {
        const breadcrumbItem: React.ReactNode =
            preventLinkOnLastItem && index === items.length - 1 ? (
                <Typography key={id} className={clsx(classes.link, classes.lastLink)} variant="body2">
                    {title}
                </Typography>
            ) : (
                <Link key={id} to={url} component={BreadcrumbLink} className={classes.link} variant="body2">
                    {title}
                </Link>
            );

        if (index === 0 && backButtonUrl) {
            return (
                <div key={id} className={classes.backAndFirstLinkContainer}>
                    <IconButton className={classes.backButton} component={BreadcrumbLink} to={backButtonUrl}>
                        <LevelUp />
                    </IconButton>
                    <div className={classes.backButtonSeparator} />
                    {breadcrumbItem}
                </div>
            );
        }

        return breadcrumbItem;
    });
