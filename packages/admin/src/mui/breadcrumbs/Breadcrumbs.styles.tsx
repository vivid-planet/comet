import { BreadcrumbsClassKey, BreadcrumbsProps } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { KeyboardArrowRight as ArrowIcon } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { useComponentThemeProps } from "../../mui/useComponentThemeProps";

export interface CometAdminBreadcrumbsThemeProps extends BreadcrumbsProps {}

export type CometAdminBreadcrumbsClassKeys = BreadcrumbsClassKey | "link" | "last";

export const useStyles = makeStyles<Theme, {}, CometAdminBreadcrumbsClassKeys>(
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
    { name: "CometAdminBreadcrumbs" },
);

export function useThemeProps(componentProps: CometAdminBreadcrumbsThemeProps) {
    const themeProps = useComponentThemeProps("CometAdminBreadcrumbs") ?? {};
    const { separator = <ArrowIcon />, ...restProps } = { ...themeProps, ...componentProps };
    return { separator, ...restProps };
}

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminBreadcrumbs: CometAdminBreadcrumbsClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminBreadcrumbs: CometAdminBreadcrumbsThemeProps;
    }
}
