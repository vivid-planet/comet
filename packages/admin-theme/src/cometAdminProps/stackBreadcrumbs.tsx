import { CometAdminStackBreadcrumbsThemeProps } from "@comet/admin";
import { ChevronRight } from "@comet/admin-icons";
import * as React from "react";

export const cometAdminStackBreadcrumbsProps = (): CometAdminStackBreadcrumbsThemeProps => ({
    separator: <ChevronRight />,
});
