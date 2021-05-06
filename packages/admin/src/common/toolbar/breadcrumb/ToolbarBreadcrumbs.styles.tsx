import { TypographyTypeMap } from "@material-ui/core/Typography/Typography";

import { useComponentThemeProps } from "../../../mui/useComponentThemeProps";

export interface ToolbarBreadcrumbsThemeProps {
    typographyProps: TypographyTypeMap["props"];
}

export function useThemeProps() {
    const { typographyProps, ...restProps } = useComponentThemeProps<ToolbarBreadcrumbsThemeProps>("CometAdminToolbarBreadcrumbs") ?? {};
    return { typographyProps, ...restProps };
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarBreadcrumbs: ToolbarBreadcrumbsThemeProps;
    }
}
