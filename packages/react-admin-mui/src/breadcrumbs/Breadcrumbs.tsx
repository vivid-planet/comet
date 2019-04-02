import { Link, Typography } from "@material-ui/core";
import { LinkProps } from "@material-ui/core/Link";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";

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
        <>
            {pages.map(({ id, url, title }, index) => {
                const isLast = index + 1 >= pages.length;

                return (
                    <React.Fragment key={id}>
                        <Link href={url} component={BreadcrumbLink} color={isLast ? "primary" : "inherit"}>
                            <Typography variant="subtitle1" color={isLast ? "primary" : "inherit"}>
                                {title}
                            </Typography>
                        </Link>
                        {!isLast && <KeyboardArrowRight />}
                    </React.Fragment>
                );
            })}
        </>
    );
};

export default Breadcrumbs;
