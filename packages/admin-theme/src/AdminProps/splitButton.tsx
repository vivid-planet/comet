import { CometAdminSplitButtonThemeProps } from "@comet/admin";
import { ChevronDown } from "@comet/admin-icons";
import * as React from "react";

export const getSplitButtonProps = (): CometAdminSplitButtonThemeProps => ({
    selectIcon: <ChevronDown />,
});
