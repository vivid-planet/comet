import { ChevronRight } from "@comet/admin-icons";
import { BreadcrumbsClassKey, BreadcrumbsProps } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { useComponentThemeProps } from "../../mui/useComponentThemeProps";

export interface CometAdminStackBreadcrumbsThemeProps extends BreadcrumbsProps {}

export type CometAdminStackBreadcrumbsClassKeys = BreadcrumbsClassKey | "link" | "last";

export const useStyles = makeStyles<Theme, {}, CometAdminStackBreadcrumbsClassKeys>(
    ({ palette }) => ({
        root: {
            paddingTop: 30,
            paddingBottom: 30,
        },
        ol: {},
        li: {},
        separator: {
            color: palette.grey[300],
            "& [class*='MuiSvgIcon-root']": {
                fontSize: 12,
            },
            link: {
                color: palette.text.primary,
                textDecoration: "underline",
                "& [class*='MuiTypography']": {
                    fontSize: 13,
                    lineHeight: "14px",
                },
            },
        },
        link: {},
        last: {
            color: palette.text.disabled,
            "&, &:hover": {
                textDecoration: "none",
            },
        },
    }),
    { name: "CometAdminStackBreadcrumbs" },
);

export function useThemeProps(componentProps: CometAdminStackBreadcrumbsThemeProps) {
    const themeProps = useComponentThemeProps("CometAdminStackBreadcrumbs") ?? {};
    const { separator = <ChevronRight />, ...restProps } = { ...themeProps, ...componentProps };
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
