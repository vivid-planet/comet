import { Theme } from "@material-ui/core/styles";
import { TypographyTypeMap } from "@material-ui/core/Typography/Typography";
import { makeStyles } from "@material-ui/styles";

import { useComponentThemeProps } from "../../../mui/useComponentThemeProps";

export interface ToolbarBreadcrumbsThemeProps {
    typographyProps: TypographyTypeMap["props"];
}

export type CometAdminToolbarBreadcrumbsClassKeys = "item" | "typographyRoot" | "typographyActiveRoot" | "separatorContainer" | "separator";

export const useStyles = makeStyles<Theme, {}, CometAdminToolbarBreadcrumbsClassKeys>(
    (theme) => ({
        item: {
            display: "flex",
            alignItems: "center",
            padding: 15,
        },
        typographyRoot: {
            fontSize: 18,
        },
        typographyActiveRoot: {
            color: theme.palette.primary.main,
        },
        separatorContainer: {
            height: "100%",
            paddingLeft: 15,
            paddingRight: 15,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        separator: {
            height: 30,
            width: 1,
            backgroundColor: theme.palette.divider,
            transform: "rotate(20deg)",
        },
    }),
    { name: "CometAdminToolbarBreadcrumbs" },
);

export function useThemeProps() {
    const { typographyProps, ...restProps } = useComponentThemeProps("CometAdminToolbarBreadcrumbs") ?? {};
    return { typographyProps, ...restProps };
}

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarBreadcrumbs: CometAdminToolbarBreadcrumbsClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarBreadcrumbs: ToolbarBreadcrumbsThemeProps;
    }
}
