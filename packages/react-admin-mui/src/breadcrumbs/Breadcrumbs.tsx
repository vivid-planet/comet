import { Link } from "@material-ui/core";
import * as React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";
import * as sc from "./Breadcrumbs.sc";

export interface IBreadcrumbItem {
    id: string;
    url: string;
    title: string;
}

export interface IBreadcrumbProps {
    pages: IBreadcrumbItem[];
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => (
    <RouterLink innerRef={ref} to={props.href!} {...props} />
));

export const Breadcrumbs = ({ pages }: IBreadcrumbProps) => {
    return (
        <sc.Root>
            {pages.map(({ id, url, title }, index) => {
                const isLast = index + 1 >= pages.length;

                return (
                    <React.Fragment key={id}>
                        <sc.LinkWrapper>
                            <Link to={url} component={BreadcrumbLink} color={isLast ? "primary" : "inherit"}>
                                <sc.Title color={isLast ? "primary" : "inherit"}>{title}</sc.Title>
                            </Link>
                        </sc.LinkWrapper>
                        {!isLast && <sc.ArrowIcon />}
                    </React.Fragment>
                );
            })}
        </sc.Root>
    );
};
