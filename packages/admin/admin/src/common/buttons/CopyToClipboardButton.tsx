import { Accept, Copy } from "@comet/admin-icons";
import { ComponentsOverrides, css, Grow, IconButton, styled, Theme, useThemeProps } from "@mui/material";
import { ThemedComponentBaseProps } from "helpers/ThemedComponentBaseProps";
import * as React from "react";

export interface CopyToClipboardButtonProps
    extends ThemedComponentBaseProps<{
        root: "div";
        buttonContainer: "div";
        copyButtonContainer: "div";
        successButtonContainer: "div";
        button: "div";
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
    showSuccess: boolean | undefined;
};

export const CopyToClipboardButton = (inProps: CopyToClipboardButtonProps): React.ReactElement => {
    const {
        copyIcon = <Copy />,
        successIcon = <Accept />,
        slotProps,
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminCopyToClipboardButton" });

    const [showSuccess, setShowSuccess] = React.useState<boolean | undefined>(false);

    const ownerState: OwnerState = {
        showSuccess: showSuccess,
    };

    const copyTextToClipboard = () => {
        navigator.clipboard.writeText(inProps.copyText);
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

const Root = styled("div", {
    name: "CometAdminCopyToClipboardButton",
    slot: "root",
    overridesResolver({ ownerState }: { ownerState: OwnerState }, styles) {
        return [styles.root, ownerState.showSuccess && styles.showSuccess];
    },
})<{ ownerState: OwnerState }>(css`
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 100%;
`);

const CopyButtonContainer = styled("div", {
    name: "CometAdminCopyToClipboardButton",
    slot: "copyButtonContainer",
    overridesResolver(_, styles) {
        return [styles.buttonContainer, styles.copyButtonContainer];
    },
})(css`
    position: relative;
    z-index: 2;
`);

const SuccessButtonContainer = styled("div", {
    name: "CometAdminCopyToClipboardButton",
    slot: "successButtonContainer",
    overridesResolver(_, styles) {
        return [styles.buttonContainer, styles.successButtonContainer];
    },
})(
    css`
        position: absolute;
        z-index: 1;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
    `,
);

const CopyButton = styled(IconButton, {
    name: "CometAdminCopyToClipboardButton",
    slot: "copyButton",
    overridesResolver(_, styles) {
        return [styles.button, styles.copyButton];
    },
})(css`
    position: relative;
`);

const SuccessButton = styled(IconButton, {
    name: "CometAdminCopyToClipboardButton",
    slot: "successButton",
    overridesResolver(_, styles) {
        return [styles.button, styles.successButton];
    },
})(css`
    position: relative;
`);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminCopyToClipboardButton: CopyToClipboardButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminCopyToClipboardButton: Partial<CopyToClipboardButtonProps>;
    }

    interface Components {
        CometAdminCopyToClipboardButton?: {
            defaultProps?: ComponentsPropsList["CometAdminCopyToClipboardButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminCopyToClipboardButton"];
        };
    }
}
