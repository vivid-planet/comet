import { CometAdminCometAdminFinalFormSaveCancelButtonsLegacyThemeProps } from "@comet/admin";
import { Close, Save } from "@comet/admin-icons";
import * as React from "react";

export const getFinalFormSaveCancelButtonsLegacyProps = (): CometAdminCometAdminFinalFormSaveCancelButtonsLegacyThemeProps => ({
    cancelIcon: <Close />,
    saveIcon: <Save />,
});
