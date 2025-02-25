import { Clear } from "@comet/admin-icons";
import { Button, type ButtonClassKey } from "@mui/material";
import { type ButtonProps } from "@mui/material/Button";
import { type Theme, useThemeProps } from "@mui/material/styles";
import { type ComponentsOverrides } from "@mui/material/styles/overrides";
import { FormattedMessage } from "react-intl";

import { createComponentSlot } from "../../../helpers/createComponentSlot";
import { messages } from "../../../messages";

export type CancelButtonProps = ButtonProps;
export type CancelButtonClassKey = ButtonClassKey;

const Root = createComponentSlot(Button)<CancelButtonClassKey>({
    componentName: "CancelButton",
    slotName: "root",
})();

export function CancelButton(inProps: CancelButtonProps) {
    const {
        children = <FormattedMessage {...messages.cancel} />,
        startIcon = <Clear />,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminCancelButton" });

    return (
        <Root color="info" startIcon={startIcon} {...restProps}>
            {children}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminCancelButton: CancelButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminCancelButton: CancelButtonProps;
    }

    interface Components {
        CometAdminCancelButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminCancelButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminCancelButton"];
        };
    }
}
