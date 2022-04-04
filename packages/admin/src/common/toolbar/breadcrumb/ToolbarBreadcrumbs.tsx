import { ComponentsOverrides, Link, Theme, Typography, TypographyTypeMap } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { Link as RouterLink, LinkProps as RouterLinkProps } from "react-router-dom";

import { StackApiContext } from "../../../stack/Api";
import { styles, ToolbarBreadcrumbsClassKey } from "./ToolbarBreadcrumbs.styles";

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, RouterLinkProps>(({ href, to, ...rest }, ref) => (
    <RouterLink innerRef={ref} to={to ?? href} {...rest} />
));

export interface ToolbarBreadcrumbsProps {
    typographyProps?: TypographyTypeMap["props"];
}

function Breadcrumbs({ typographyProps, classes }: ToolbarBreadcrumbsProps & WithStyles<typeof styles>): React.ReactElement {
    return (
        <StackApiContext.Consumer>
            {(stackApi) => {
                return (
                    <>
                        {stackApi?.breadCrumbs.map(({ id, url, title }, index) => {
                            const showSeparator = index < stackApi?.breadCrumbs.length - 1;
                            const isActive = index === stackApi?.breadCrumbs.length - 1;
                            return (
                                <React.Fragment key={id}>
                                    <div className={classes.item}>
                                        <Typography
                                            {...typographyProps}
                                            classes={{ root: `${classes.typographyRoot} ${isActive ? classes.typographyActiveRoot : ""}` }}
                                        >
                                            <Link to={url} component={BreadcrumbLink} color={"inherit"}>
                                                {title}
                                            </Link>
                                        </Typography>
                                    </div>
                                    {showSeparator && (
                                        <div className={classes.separatorContainer}>
                                            <div className={classes.separator} />
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </>
                );
            }}
        </StackApiContext.Consumer>
    );
}
export const ToolbarBreadcrumbs = withStyles(styles, { name: "CometAdminToolbarBreadcrumbs" })(Breadcrumbs);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarBreadcrumbs: ToolbarBreadcrumbsClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbarBreadcrumbs: ToolbarBreadcrumbsProps;
    }

    interface Components {
        CometAdminToolbarBreadcrumbs?: {
            defaultProps?: ComponentsPropsList["CometAdminToolbarBreadcrumbs"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarBreadcrumbs"];
        };
    }
}
