import { Lock } from "@comet/admin-icons";
import { type ComponentsOverrides, css, InputAdornment, type InputAdornmentProps, type Theme, useThemeProps } from "@mui/material";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

type ReadOnlyAdornmentClassKey = "root";

type ReadOnlyAdornmentProps = ThemedComponentBaseProps<{
    root: typeof InputAdornment;
}> & {
    position?: InputAdornmentProps["position"];
    inputIsReadOnly: boolean;
} & Omit<InputAdornmentProps, "position">;

export const ReadOnlyAdornment = (inProps: ReadOnlyAdornmentProps) => {
    const {
        position = "end",
        children = <Lock fontSize="inherit" />,
        inputIsReadOnly,
        slotProps,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminReadOnlyAdornment",
    });

    if (!inputIsReadOnly) {
        return null;
    }

    return (
        <Root position={position} {...slotProps?.root} {...restProps}>
            {children}
        </Root>
    );
};

const Root = createComponentSlot(InputAdornment)<ReadOnlyAdornmentClassKey>({
    componentName: "ReadOnlyAdornment",
    slotName: "root",
})(css`
    font-size: 12px;
`);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminReadOnlyAdornment: ReadOnlyAdornmentProps;
    }

    interface ComponentNameToClassKey {
        CometAdminReadOnlyAdornment: ReadOnlyAdornmentClassKey;
    }

    interface Components {
        CometAdminReadOnlyAdornment?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminReadOnlyAdornment"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminReadOnlyAdornment"];
        };
    }
}
