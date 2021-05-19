import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from "@material-ui/core";
import * as React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { StackApiContext } from "../Api";
import { CometAdminStackBreadcrumbsThemeProps, useStyles, useThemeProps } from "./StackBreadcrumbs.styles";

export interface StackBreadcrumbProps extends CometAdminStackBreadcrumbsThemeProps {}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href, to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to ?? href} {...rest} />
));

export const StackBreadcrumbs = (props: StackBreadcrumbProps): React.ReactElement => {
    const classes = useStyles();

    const { separator, ...otherBreadcrumbProps } = useThemeProps(props);

    return (
        <StackApiContext.Consumer>
            {(stackApi) => {
                return (
                    <MuiBreadcrumbs
                        classes={{ root: classes.root, ol: classes.ol, li: classes.li, separator: classes.separator }}
                        separator={separator}
                        {...otherBreadcrumbProps}
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
