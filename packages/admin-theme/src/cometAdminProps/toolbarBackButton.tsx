import { ToolbarBackButtonThemeProps } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import * as React from "react";

export const cometAdminToolbarBackButtonProps = (): ToolbarBackButtonThemeProps => ({
    backIcon: <ArrowLeft />,
});
