import { Breadcrumbs as MuiBreadcrumbs, BreadcrumbsClassKey, BreadcrumbsProps, createStyles, Link, Typography, WithStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { KeyboardArrowRight as ArrowIcon } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import * as React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

export interface IBreadcrumbItem {
    id: string;
    url: string;
    title: React.ReactNode;
}

export interface CometAdminBreadcrumbsThemeProps extends BreadcrumbsProps {}

export interface IBreadcrumbProps extends CometAdminBreadcrumbsThemeProps {
    pages: IBreadcrumbItem[];
}

export type CometAdminBreadcrumbsClassKeys = BreadcrumbsClassKey | "link" | "last";

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href, to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to ?? href} {...rest} />
));

const BreadcrumbsComponent = ({
    classes,
    pages,
    separator = <ArrowIcon />,
    ...otherBreadcrumbProps
}: IBreadcrumbProps & WithStyles<typeof styles>): React.ReactElement => {
    return (
        <MuiBreadcrumbs
            classes={{ root: classes.root, ol: classes.ol, li: classes.li, separator: classes.separator }}
            separator={separator}
            {...otherBreadcrumbProps}
        >
            {pages.map(({ id, url, title }, index) => {
                const isLast = index + 1 >= pages.length;
                const linkClassName = classes.link + (isLast ? ` ${classes.last}` : "");

                return (
                    <Link key={id} to={url} component={BreadcrumbLink} className={linkClassName}>
                        <Typography variant="body2">{title}</Typography>
                    </Link>
                );
            })}
        </MuiBreadcrumbs>
    );
};

const styles = (theme: Theme) =>
    createStyles<CometAdminBreadcrumbsClassKeys, any>({
        root: {},
        ol: {},
        li: {},
        separator: {
            color: theme.palette.text.primary,
        },
        link: {},
        last: {},
    });

export const Breadcrumbs = withStyles(styles, { name: "CometAdminBreadcrumbs", withTheme: true })(BreadcrumbsComponent);
