import { ClearInputButtonThemeProps } from "@comet/admin";
import { Clear } from "@comet/admin-icons";
import * as React from "react";

export const getClearInputButtonProps = (): ClearInputButtonThemeProps => ({
    icon: (disabled) => <Clear color={disabled ? "disabled" : "action"} />,
});
