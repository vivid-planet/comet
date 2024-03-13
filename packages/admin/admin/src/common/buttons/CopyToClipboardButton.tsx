import { Accept, Copy } from "@comet/admin-icons";
import { ComponentsOverrides, css, Grow, IconButton, Theme, useThemeProps } from "@mui/material";
import * as React from "react";

import { createComponentSlot } from "../../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";

export interface CopyToClipboardButtonProps
    extends ThemedComponentBaseProps<{
        root: "div";
        copyButtonContainer: "div";
        successButtonContainer: "div";
        copyButton: typeof IconButton;
        successButton: typeof IconButton;
    }> {
    copyText: string;
    copyIcon?: React.ReactNode;
    successIcon?: React.ReactNode;
}

export type CopyToClipboardButtonClassKey =
    | "root"
    | "showSuccess"
    | "buttonContainer"
    | "copyButtonContainer"
    | "successButtonContainer"
    | "button"
    | "copyButton"
    | "successButton";

type OwnerState = {
    showSuccess: boolean;
};

export const CopyToClipboardButton = (inProps: CopyToClipboardButtonProps): React.ReactElement => {
    const {
        copyText,
        copyIcon = <Copy />,
        successIcon = <Accept />,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminCopyToClipboardButton" });

    const [showSuccess, setShowSuccess] = React.useState<boolean>(false);

    const ownerState: OwnerState = {
        showSuccess: showSuccess,
    };

    const copyTextToClipboard = () => {
        navigator.clipboard.writeText(copyText);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    return (
        <Root ownerState={ownerState} {...slotProps?.root} {...restProps}>
            <CopyButtonContainer {...slotProps?.copyButtonContainer}>
                <Grow in={!showSuccess}>
                    <CopyButton
                        color="primary"
                        {...slotProps?.copyButton}
                        onClick={(e) => {
                            copyTextToClipboard();
                            slotProps?.copyButton?.onClick && slotProps.copyButton.onClick(e);
                        }}
                    >
                        {copyIcon}
                    </CopyButton>
                </Grow>
            </CopyButtonContainer>
            <SuccessButtonContainer {...slotProps?.successButtonContainer}>
                <Grow in={showSuccess}>
                    <SuccessButton
                        color="success"
                        {...slotProps?.successButton}
                        onClick={(e) => {
                            copyTextToClipboard();
                            slotProps?.successButton?.onClick && slotProps.successButton.onClick(e);
                        }}
                    >
                        {successIcon}
                    </SuccessButton>
                </Grow>
            </SuccessButtonContainer>
        </Root>
    );
};

const Root = createComponentSlot("div")<CopyToClipboardButtonClassKey, OwnerState>({
    componentName: "CopyToClipboardButton",
    slotName: "root",
    classesResolver(ownerState) {
        return [ownerState.showSuccess && "showSuccess"];
    },
})(css`
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
`);

const CopyButtonContainer = createComponentSlot("div")<CopyToClipboardButtonClassKey>({
    componentName: "CopyToClipboardButton",
    slotName: "copyButtonContainer",
    classesResolver() {
        return ["buttonContainer"];
    },
})(css`
    position: relative;
    z-index: 2;
`);

const SuccessButtonContainer = createComponentSlot("div")<CopyToClipboardButtonClassKey>({
    componentName: "CopyToClipboardButton",
    slotName: "successButtonContainer",
    classesResolver() {
        return ["buttonContainer"];
    },
})(css`
    position: absolute;
    z-index: 1;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
`);

const CopyButton = createComponentSlot(IconButton)<CopyToClipboardButtonClassKey>({
    componentName: "CopyToClipboardButton",
    slotName: "copyButton",
    classesResolver() {
        return ["button"];
    },
})(css`
    position: relative;
`);

const SuccessButton = createComponentSlot(IconButton)<CopyToClipboardButtonClassKey>({
    componentName: "CopyToClipboardButton",
    slotName: "successButton",
    classesResolver() {
        return ["button"];
    },
})(css`
    position: relative;
`);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminCopyToClipboardButton: CopyToClipboardButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminCopyToClipboardButton: CopyToClipboardButtonProps;
    }

    interface Components {
        CometAdminCopyToClipboardButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminCopyToClipboardButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminCopyToClipboardButton"];
        };
    }
}
