import { type ComponentsOverrides, type Theme } from "@mui/material";
import { css, useThemeProps } from "@mui/material/styles";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

export type AppHeaderFillSpaceClassKey = "root";

export type AppHeaderFillSpaceProps = ThemedComponentBaseProps<{
    root: "div";
}>;

const Root = createComponentSlot("div")<AppHeaderFillSpaceClassKey>({
    componentName: "AppHeaderFillSpace",
    slotName: "root",
})(css`
    flex-grow: 1;
`);

/**
 * @deprecated Use `FillSpace` instead.
 */
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
