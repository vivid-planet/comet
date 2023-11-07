import { Accept, Copy } from "@comet/admin-icons";
import { ComponentsOverrides, Grow, IconButton, SvgIconProps, Theme } from "@mui/material";
import { IconButtonProps } from "@mui/material/IconButton/IconButton";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import clsx from "clsx";
import * as React from "react";

export interface CopyToClipboardButtonComponents {
    CopyIcon?: React.ElementType;
    SuccessIcon?: React.ElementType;
}

export interface CopyToClipboardButtonComponentsProps {
    CopyButton?: Partial<IconButtonProps>;
    successButton?: Partial<IconButtonProps>;
    copyIcon?: Partial<SvgIconProps>;
    successIcon?: Partial<SvgIconProps>;
}

export interface CopyToClipboardButtonProps {
    copyText: string;
    components?: CopyToClipboardButtonComponents;
    componentsProps?: CopyToClipboardButtonComponentsProps;
}

const CopyToClipboardButton = ({
    classes,
    copyText,
    components = {},
    componentsProps = {},
}: CopyToClipboardButtonProps & WithStyles<typeof styles>): React.ReactElement => {
    const { CopyIcon = Copy, SuccessIcon = Accept } = components;

    const {
        CopyButton: { className: CopyButtonClassName, onClick: CopyButtonOnClick, ...restCopyButtonProps } = {},
        successButton: { className: successButtonClassName, onClick: successButtonOnClick, ...restSuccessButtonProps } = {},
        copyIcon: copyIconProps,
        successIcon: successIconProps,
    } = componentsProps;

    const [showSuccess, setShowSuccess] = React.useState<boolean>(false);

    const copyTextToClipboard = () => {
        navigator.clipboard.writeText(copyText);
        setShowSuccess(true);

        setTimeout(() => {
            setShowSuccess(false);
        }, 3000);
    };

    return (
        <div className={clsx(classes.root, showSuccess && classes.showSuccess)}>
            <div className={clsx(classes.buttonContainer, classes.copyButtonContainer)}>
                <Grow in={!showSuccess}>
                    <IconButton
                        color="primary"
                        onClick={(e) => {
                            copyTextToClipboard();
                            CopyButtonOnClick && CopyButtonOnClick(e);
                        }}
                        className={clsx(classes.button, classes.copyButton, CopyButtonClassName && CopyButtonClassName)}
                        {...restCopyButtonProps}
                    >
                        <CopyIcon {...copyIconProps} />
                    </IconButton>
                </Grow>
            </div>
            <div className={clsx(classes.buttonContainer, classes.successButtonContainer)}>
                <Grow in={showSuccess}>
                    <IconButton
                        color="success"
                        onClick={(e) => {
                            copyTextToClipboard();
                            successButtonOnClick && successButtonOnClick(e);
                        }}
                        className={clsx(classes.button, classes.successButton, successButtonClassName && successButtonClassName)}
                        {...restSuccessButtonProps}
                    >
                        <SuccessIcon {...successIconProps} />
                    </IconButton>
                </Grow>
            </div>
        </div>
    );
};

export type CopyToClipboardButtonClassKey =
    | "root"
    | "showSuccess"
    | "buttonContainer"
    | "copyButtonContainer"
    | "successButtonContainer"
    | "button"
    | "copyButton"
    | "successButton";

const styles = () =>
    createStyles<CopyToClipboardButtonClassKey, CopyToClipboardButtonProps>({
        root: {
            position: "relative",
            height: "100%",
            display: "inline-flex",
            alignItems: "center",
        },
        showSuccess: {
            "& $successButtonContainer": {
                zIndex: 3,
            },
        },
        buttonContainer: {},
        copyButtonContainer: {
            position: "relative",
            zIndex: 2,
        },
        successButtonContainer: {
            position: "absolute",
            zIndex: 1,
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
        },
        button: {
            position: "relative",
        },
        copyButton: {},
        successButton: {},
    });

const CopyToClipboardButtonWithStyles = withStyles(styles, { name: "CometAdminCopyToClipboardButton" })(CopyToClipboardButton);

export { CopyToClipboardButtonWithStyles as CopyToClipboardButton };

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
