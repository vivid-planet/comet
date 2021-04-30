import { ErrorBoundaryThemeProps } from "@comet/admin";
import { Error } from "@comet/admin-icons";
import * as React from "react";

export default (): ErrorBoundaryThemeProps => ({
    variant: "filled",
    icon: <Error />,
});
