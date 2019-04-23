import { Link } from "@material-ui/core";
import { LinkProps } from "@material-ui/core/Link";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import * as sc from "./Breadcrumbs.sc";

export interface IBreadcrumbItem {
    id: string;
    url: string;
    title: string;
}

export interface IBreadcrumbProps {
    pages: IBreadcrumbItem[];
}

const BreadcrumbLink = (props: LinkProps) => (
    <RouterLink to={props.href!} className={props.className}>
        {props.children}
    </RouterLink>
);

export const Breadcrumbs = ({ pages }: IBreadcrumbProps) => {
    return (
        <sc.Root>
            {pages.map(({ id, url, title }, index) => {
                const isLast = index + 1 >= pages.length;

                return (
                    <React.Fragment key={id}>
                        <sc.LinkWrapper>
                            <Link href={url} component={BreadcrumbLink} color={isLast ? "primary" : "inherit"}>
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
