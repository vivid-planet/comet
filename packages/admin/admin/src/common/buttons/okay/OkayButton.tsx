import { Check } from "@comet/admin-icons";
import { Button, ButtonClassKey, ButtonProps } from "@mui/material";
import { ComponentsOverrides, Theme, useThemeProps } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { messages } from "../../../messages";

export type OkayButtonClassKey = ButtonClassKey;
export type OkayButtonProps = ButtonProps;

const Root = createComponentSlot(Button)<OkayButtonClassKey>({
    componentName: "OkayButton",
    slotName: "root",
})();

export function OkayButton(inProps: OkayButtonProps) {
    const {
        children = <FormattedMessage {...messages.ok} />,
        startIcon = <Check />,
        color = "primary",
        variant = "contained",
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminOkayButton" });

    return (
        <Root startIcon={startIcon} color={color} variant={variant} {...restProps}>
            {children}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminOkayButton: OkayButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminOkayButton: OkayButtonProps;
    }

    interface Components {
        CometAdminOkayButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminOkayButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminOkayButton"];
        };
    }
}
