import { type ComponentsOverrides, type Theme } from "@mui/material";
import { css, useThemeProps } from "@mui/material/styles";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type FillSpaceClassKey = "root";

export type FillSpaceProps = ThemedComponentBaseProps<{
    root: "div";
}>;

const Root = createComponentSlot("div")<FillSpaceClassKey>({
    componentName: "FillSpace",
    slotName: "root",
})(css`
    flex-grow: 1;
`);

export function FillSpace(inProps: FillSpaceProps) {
    const { slotProps, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminFillSpace" });
    return <Root {...slotProps?.root} {...restProps} />;
}

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFillSpace: FillSpaceProps;
    }

    interface ComponentNameToClassKey {
        CometAdminFillSpace: FillSpaceClassKey;
    }

    interface Components {
        CometAdminFillSpace?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFillSpace"];
        };
    }
}
