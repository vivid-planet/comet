import { ChevronDown } from "@comet/admin-icons";
import * as React from "react";

import { useComponentThemeProps } from "../../../mui/useComponentThemeProps";

export interface CometAdminSplitButtonThemeProps {
    selectIcon?: React.ReactNode;
}

export function useThemeProps() {
    const { selectIcon = <ChevronDown />, ...restProps } = useComponentThemeProps("CometAdminSplitButton") ?? {};
    return { selectIcon, ...restProps };
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminSplitButton: CometAdminSplitButtonThemeProps;
    }
}
