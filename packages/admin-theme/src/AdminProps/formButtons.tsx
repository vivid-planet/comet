import { CometAdminFormButtonsThemeProps } from "@comet/admin";
import { Close, Save } from "@comet/admin-icons";
import * as React from "react";

export const getFormButtonsProps = (): CometAdminFormButtonsThemeProps => ({
    cancelIcon: <Close />,
    saveIcon: <Save />,
});
