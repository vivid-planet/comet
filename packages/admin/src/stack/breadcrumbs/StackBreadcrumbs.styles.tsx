import { BreadcrumbsClassKey, BreadcrumbsProps } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { KeyboardArrowRight as ArrowIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { useComponentThemeProps } from "../../mui/useComponentThemeProps";

export interface CometAdminStackBreadcrumbsThemeProps extends BreadcrumbsProps {}

export type CometAdminStackBreadcrumbsClassKeys = BreadcrumbsClassKey | "link" | "last";

export const useStyles = makeStyles<Theme, {}, CometAdminStackBreadcrumbsClassKeys>(
    (theme) => ({
        root: {
            paddingTop: 30,
            paddingBottom: 30,
        },
        ol: {},
        li: {},
        separator: {
            color: theme.palette.text.primary,
        },
        link: {},
        last: {},
    }),
    { name: "CometAdminStackBreadcrumbs" },
);

export function useThemeProps(componentProps: CometAdminStackBreadcrumbsThemeProps) {
    const themeProps = useComponentThemeProps("CometAdminStackBreadcrumbs") ?? {};
    const { separator = <ArrowIcon />, ...restProps } = { ...themeProps, ...componentProps };
    return { separator, ...restProps };
}

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminStackBreadcrumbs: CometAdminStackBreadcrumbsClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminStackBreadcrumbs: CometAdminStackBreadcrumbsThemeProps;
    }
}
