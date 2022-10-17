import * as React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href, to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to ?? href} {...rest} />
));
