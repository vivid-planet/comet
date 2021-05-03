import { Link, Typography } from "@material-ui/core";
import * as React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { IBreadcrumbProps } from "../../mui";
import { ToolbarItem } from "./ToolbarItem";

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href, to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to ?? href} {...rest} />
));

export const ToolbarBreadcrumbs = ({ pages }: IBreadcrumbProps) => {
    return (
        <>
            {pages.map(({ id, url, title }, index) => {
                return (
                    <ToolbarItem key={id}>
                        <Link to={url} component={BreadcrumbLink} color={"inherit"}>
                            <Typography variant={"h4"}>{title}</Typography>
                        </Link>
                    </ToolbarItem>
                );
            })}
        </>
    );
};
