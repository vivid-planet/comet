import { Grid, Link, Typography } from "@material-ui/core";
import { KeyboardArrowRight as ArrowIcon } from "@material-ui/icons";
import * as React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

export interface IBreadcrumbItem {
    id: string;
    url: string;
    title: string;
}

export interface IBreadcrumbProps {
    pages: IBreadcrumbItem[];
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href, to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to ?? href} {...rest} />
));

export const Breadcrumbs = ({ pages }: IBreadcrumbProps) => {
    return (
        <Grid container alignItems="center" spacing={2}>
            {pages.map(({ id, url, title }, index) => {
                const isLast = index + 1 >= pages.length;

                return (
                    <React.Fragment key={id}>
                        <Grid item>
                            <Link to={url} component={BreadcrumbLink} color={isLast ? "primary" : "inherit"}>
                                <Typography variant="body2" color={isLast ? "primary" : "inherit"}>
                                    {title}
                                </Typography>
                            </Link>
                        </Grid>
                        {!isLast && <ArrowIcon />}
                    </React.Fragment>
                );
            })}
        </Grid>
    );
};
