import { type ComponentsOverrides, css, IconButton, InputAdornment, type InputAdornmentProps, type Theme, useThemeProps } from "@mui/material";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

type OpenPickerAdornmentClassKey = "root" | "openPickerButton" | "inputIsDisabled";

type OpenPickerAdornmentProps = ThemedComponentBaseProps<{
    root: typeof InputAdornment;
    openPickerButton: typeof IconButton;
}> & {
    inputIsDisabled?: boolean;
    inputIsReadOnly?: boolean;
    onClick?: () => void;
    position?: InputAdornmentProps["position"];
} & Omit<InputAdornmentProps, "position">;

type OwnerState = {
    inputIsDisabled: boolean;
};

export const OpenPickerAdornment = (inProps: OpenPickerAdornmentProps) => {
    const {
        inputIsDisabled,
        inputIsReadOnly,
        onClick,
        position = "start",
        slotProps,
        children,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminOpenPickerAdornment",
    });

    const ownerState: OwnerState = {
        inputIsDisabled: Boolean(inputIsDisabled),
    };

    return (
        <Root position={position} ownerState={ownerState} {...slotProps?.root} {...restProps}>
            <OpenPickerButton
                onClick={onClick}
                disabled={inputIsDisabled || inputIsReadOnly}
                ownerState={ownerState}
                {...slotProps?.openPickerButton}
            >
                {children}
            </OpenPickerButton>
        </Root>
    );
};

const Root = createComponentSlot(InputAdornment)<OpenPickerAdornmentClassKey, OwnerState>({
    componentName: "OpenPickerAdornment",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.inputIsDisabled && "inputIsDisabled"];
    },
})();

const OpenPickerButton = createComponentSlot(IconButton)<OpenPickerAdornmentClassKey, OwnerState>({
    componentName: "OpenPickerAdornment",
    slotName: "openPickerButton",
})(
    ({ theme, ownerState: { inputIsDisabled } }) => css`
        ${!inputIsDisabled &&
        css`
            &.Mui-disabled {
                color: ${theme.palette.text.primary};
            }
        `}
    `,
);

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminOpenPickerAdornment: OpenPickerAdornmentProps;
    }

    interface ComponentNameToClassKey {
        CometAdminOpenPickerAdornment: OpenPickerAdornmentClassKey;
    }

    interface Components {
        CometAdminOpenPickerAdornment?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminOpenPickerAdornment"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminOpenPickerAdornment"];
        };
    }
}
