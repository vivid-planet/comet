import { CometAdminBreadcrumbsThemeProps } from "@comet/admin";
import { ChevronRight } from "@comet/admin-icons";
import * as React from "react";

export const cometAdminBreadcrumbsProps = (): CometAdminBreadcrumbsThemeProps => ({
    separator: <ChevronRight />,
});
