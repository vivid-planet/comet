import { CometAdminStackBackButtonThemeProps } from "@comet/admin";
import { ArrowBack } from "@material-ui/icons";
import * as React from "react";

export const getCometAdminStackBackButtonProps = (): CometAdminStackBackButtonThemeProps => ({
    buttonProps: {
        startIcon: <ArrowBack />,
    },
});
