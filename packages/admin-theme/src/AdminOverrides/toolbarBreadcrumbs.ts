import { CometAdminToolbarBreadcrumbsClassKeys } from "@comet/admin/lib/common/toolbar/breadcrumb/ToolbarBreadcrumbs.styles";
import { StyleRules } from "@material-ui/styles/withStyles";

export const getToolbarBreadcrumbsOverrides = (): StyleRules<{}, CometAdminToolbarBreadcrumbsClassKeys> => ({
    item: {},
    typographyRoot: {},
    typographyActiveRoot: {},
    separatorContainer: {},
    separator: {},
});
