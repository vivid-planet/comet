import { ErrorBoundaryThemeProps } from "@comet/admin";
import { ChevronDown, ChevronRight, Error } from "@comet/admin-icons";
import * as React from "react";

export const getCometAdminErrorBoundaryProps = (): ErrorBoundaryThemeProps => ({
    variant: "filled",
    icon: <Error />,
    toggleDetailsOpenedIcon: <ChevronRight fontSize={"small"} />,
    toggleDetailsClosedIcon: <ChevronDown fontSize={"small"} />,
});
