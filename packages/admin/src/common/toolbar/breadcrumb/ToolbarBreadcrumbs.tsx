import { Link, Typography } from "@material-ui/core";
import * as React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { ToolbarItem } from "../titleitem/ToolbarItem";

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href, to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to ?? href} {...rest} />
));

interface IBreadcrumbItem {
    id: string;
    url: string;
    title: React.ReactNode;
}

interface ToolbarBreadcrumbProps {
    pages: IBreadcrumbItem[];
}
export const ToolbarBreadcrumbs: React.FunctionComponent<ToolbarBreadcrumbProps> = ({ pages }) => {
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
