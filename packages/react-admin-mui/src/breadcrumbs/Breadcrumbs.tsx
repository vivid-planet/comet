import { Link } from "@material-ui/core";
import { LinkProps } from "@material-ui/core/Link";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Root, Title } from "./Breadcrumbs.sc";

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

const Breadcrumbs = ({ pages }: IBreadcrumbProps) => {
    return (
        <Root>
            {pages.map(({ id, url, title }, index) => {
                const isLast = index + 1 >= pages.length;

                return (
                    <React.Fragment key={id}>
                        <Link href={url} component={BreadcrumbLink} color={isLast ? "primary" : "inherit"}>
                            <Title color={isLast ? "primary" : "inherit"}>{title}</Title>
                        </Link>
                        {!isLast && <KeyboardArrowRight />}
                    </React.Fragment>
                );
            })}
        </Root>
    );
};

export default Breadcrumbs;
