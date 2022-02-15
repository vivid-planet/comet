import { ChevronRight } from "@comet/admin-icons";
import { Breadcrumbs as MuiBreadcrumbs, BreadcrumbsProps, Link, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { StackApiContext } from "../Api";
import { StackBreadcrumbsClassKey, styles } from "./StackBreadcrumbs.styles";

export type StackBreadcrumbProps = BreadcrumbsProps;

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href, to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to ?? href} {...rest} />
));

const StackBreadcrumbsComponent = ({
    separator = <ChevronRight />,
    classes,
    ...otherProps
}: StackBreadcrumbProps & WithStyles<typeof styles>): React.ReactElement => {
    return (
        <StackApiContext.Consumer>
            {(stackApi) => {
                return (
                    <MuiBreadcrumbs
                        classes={{ root: classes.root, ol: classes.ol, li: classes.li, separator: classes.separator }}
                        separator={separator}
                        {...otherProps}
                    >
                        {stackApi?.breadCrumbs.map(({ id, url, title }, index) => {
                            const isLast = index + 1 >= stackApi?.breadCrumbs.length;
                            const linkClassName = classes.link + (isLast ? ` ${classes.last}` : "");

                            return (
                                <Link key={id} to={url} component={BreadcrumbLink} className={linkClassName}>
                                    <Typography variant="body2">{title}</Typography>
                                </Link>
                            );
                        })}
                    </MuiBreadcrumbs>
                );
            }}
        </StackApiContext.Consumer>
    );
};

export const StackBreadcrumbs = withStyles(styles, { name: "CometAdminStackBreadcrumbs" })(StackBreadcrumbsComponent);

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminStackBreadcrumbs: StackBreadcrumbsClassKey;
    }
}

declare module "@mui/material/styles/props" {
    interface ComponentsPropsList {
        CometAdminStackBreadcrumbs: StackBreadcrumbProps;
    }
}
