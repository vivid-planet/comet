import { IBreadcrumbItem, IStackApi, StackApiContext } from "@comet/admin";
import { Link, Typography } from "@material-ui/core";
import * as React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { ToolbarItem } from "../item/ToolbarItem";

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href, to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to ?? href} {...rest} />
));

export const ToolbarBreadcrumbs: React.FunctionComponent = () => {
    return (
        <StackApiContext.Consumer>
            {(stackApi: IStackApi | undefined) => {
                return (
                    <>
                        {stackApi?.breadCrumbs.map(({ id, url, title }: IBreadcrumbItem) => {
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
            }}
        </StackApiContext.Consumer>
    );
};
