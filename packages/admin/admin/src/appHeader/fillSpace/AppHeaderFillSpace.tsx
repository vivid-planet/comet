import { ComponentsOverrides, Theme } from "@mui/material";
import { css, styled, useThemeProps } from "@mui/material/styles";
import * as React from "react";

import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

export type AppHeaderFillSpaceClassKey = "root";

export type AppHeaderFillSpaceProps = ThemedComponentBaseProps<{
    root: "div";
}>;

const Root = styled("div", {
    name: "CometAdminAppHeaderFillSpace",
    slot: "root",
    overridesResolver(_, styles) {
        return [styles.root];
    },
})(
    css`
        flex-grow: 1;
    `,
);

export function AppHeaderFillSpace(inProps: AppHeaderFillSpaceProps) {
    const { slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminAppHeaderFillSpace" });

    return <Root {...slotProps?.root} {...restProps} />;
}

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminAppHeaderFillSpace: AppHeaderFillSpaceProps;
    }

    interface ComponentNameToClassKey {
        CometAdminAppHeaderFillSpace: AppHeaderFillSpaceClassKey;
    }

    interface Components {
        CometAdminAppHeaderFillSpace?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminAppHeaderFillSpace"];
        };
    }
}
