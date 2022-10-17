import { LevelUp } from "@comet/admin-icons";
import { IconButton, Link, Typography } from "@mui/material";
import { WithStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

import { BreadcrumbItem } from "../Stack";
import { BreadcrumbLink } from "./BreadcrumbLink";
import { styles } from "./StackBreadcrumbs.styles";

interface BreadcrumbsEntryProps {
    item: BreadcrumbItem;
    isLastItem?: boolean;
    backButtonUrl?: string;
}

export const BreadcrumbsEntry = ({
    item,
    isLastItem,
    backButtonUrl,
    classes,
}: BreadcrumbsEntryProps & WithStyles<typeof styles>): React.ReactElement => (
    <>
        {backButtonUrl && (
            <>
                <IconButton className={classes.backButton} component={BreadcrumbLink} to={backButtonUrl}>
                    <LevelUp />
                </IconButton>
                <div className={classes.backButtonSeparator} />
            </>
        )}
        {isLastItem ? (
            <Typography className={clsx(classes.link, classes.disabledLink)} variant="body2">
                {item.title}
            </Typography>
        ) : (
            <Link to={item.url} component={BreadcrumbLink} className={classes.link} variant="body2">
                {item.title}
            </Link>
        )}
    </>
);
