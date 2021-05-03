import { ToolbarThemeProps } from "@comet/admin";
import { ArrowLeft } from "@comet/admin-icons";
import * as React from "react";

export const cometAdminToolbarProps = (): ToolbarThemeProps => ({
    backIcon: <ArrowLeft />,
    elevation: 1,
});
