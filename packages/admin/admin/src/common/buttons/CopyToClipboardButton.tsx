import { Accept, Copy } from "@dextinity/admin-icons";
import { IconButton, type IconButtonProps } from "@dextinity/ui";
import { css, styled } from "@mui/material/styles";
import { type ComponentProps, type ReactNode, useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";

export interface CopyToClipboardButtonProps {
    copyText: string;
    copyIcon?: ReactNode;
    successIcon?: ReactNode;
    className?: string;
    slotProps?: {
        root?: Partial<ComponentProps<"div">>;
        copyButton?: Partial<IconButtonProps>;
        successButton?: Partial<IconButtonProps>;
    };
}

export type CopyToClipboardButtonClassKey =
    "root" | "showSuccess" | "buttonContainer" | "copyButtonContainer" | "successButtonContainer" | "button" | "copyButton" | "successButton";

export const CopyToClipboardButton = ({
    copyText,
    copyIcon = <Copy />,
    successIcon = <Accept />,
    className,
    slotProps,
}: CopyToClipboardButtonProps) => {
    const intl = useIntl();
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const copyTextToClipboard = () => {
        navigator.clipboard.writeText(copyText);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    const { onClick: onButtonClick, ...buttonProps } = (showSuccess ? slotProps?.successButton : slotProps?.copyButton) ?? {};

    return (
        <Root className={className} {...slotProps?.root}>
            <IconButton
                label={
                    showSuccess
                        ? intl.formatMessage({ id: "dextinity.copyToClipboardButton.copied", defaultMessage: "Copied" })
                        : intl.formatMessage(messages.copy)
                }
                tone={showSuccess ? "success" : "default"}
                {...buttonProps}
                onClick={(event) => {
                    copyTextToClipboard();
                    onButtonClick?.(event);
                }}
            >
                {showSuccess ? successIcon : copyIcon}
            </IconButton>
        </Root>
    );
};

const Root = styled("div")(css`
    display: inline-flex;
    align-items: center;
    height: 100%;
`);
