import { ButtonTypeMap } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import * as React from "react";

import { useComponentThemeProps } from "../../mui/useComponentThemeProps";

export interface CometAdminStackBackButtonThemeProps {
    buttonProps?: ButtonTypeMap["props"];
}

export function useThemeProps() {
    const { buttonProps = { endIcon: <ArrowBack /> }, ...restProps } = useComponentThemeProps("CometAdminStackBackButton") ?? {};

    return { buttonProps, ...restProps };
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminStackBackButton: CometAdminStackBackButtonThemeProps;
    }
}
