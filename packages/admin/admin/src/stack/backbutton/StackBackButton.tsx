import { ArrowLeft } from "@comet/admin-icons";
import { ButtonClassKey, ComponentsOverrides } from "@mui/material";
import { Theme, useThemeProps } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

import { Button, ButtonProps } from "../../common/buttons/Button";
import { createComponentSlot } from "../../helpers/createComponentSlot";
import { messages } from "../../messages";
import { StackApiContext } from "../Api";

export type StackBackButtonClassKey = ButtonClassKey;
export type StackBackButtonProps = ButtonProps;

const Root = createComponentSlot(Button)<StackBackButtonClassKey>({
    componentName: "StackBackButton",
    slotName: "root",
})();

export function StackBackButton(inProps: StackBackButtonProps) {
    const { startIcon = <ArrowLeft />, ...restProps } = useThemeProps({ props: inProps, name: "CometAdminStackBackButton" });

    return (
        <StackApiContext.Consumer>
            {(stackApi) => {
                return (
                    <Root
                        disabled={stackApi?.breadCrumbs == null || stackApi?.breadCrumbs.length <= 1}
                        onClick={stackApi?.goBack}
                        startIcon={startIcon}
                        variant="textDark"
                        {...restProps}
                    >
                        <FormattedMessage {...messages.back} />
                    </Root>
                );
            }}
        </StackApiContext.Consumer>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminStackBackButton: StackBackButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminStackBackButton: StackBackButtonProps;
    }

    interface Components {
        CometAdminStackBackButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminStackBackButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminStackBackButton"];
        };
    }
}
