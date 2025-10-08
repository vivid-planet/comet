import { QuestionMark } from "@comet/admin-icons";
import { type ComponentsOverrides, type DialogContent, type IconButton, type Theme, useThemeProps } from "@mui/material";
import { type FunctionComponent, type ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";

import { type ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { type Dialog } from "../../Dialog";
import { HelpButton, HelpDialog, HelpDialogContent, Root } from "./HelpDialogButton.sc";

export type HelpDialogButtonClassKey = "root" | "button" | "dialog" | "dialogContent";

export type HelpDialogButtonProps = ThemedComponentBaseProps<{
    root: "div";
    button: typeof IconButton;
    dialog: typeof Dialog;
    dialogContent: typeof DialogContent;
}> & {
    dialogTitle?: ReactNode;
    dialogDescription: ReactNode;
    icon?: ReactNode;
};

export const HelpDialogButton: FunctionComponent<HelpDialogButtonProps> = (inProps) => {
    const {
        dialogTitle = <FormattedMessage id="comet.toolbar.actions.helpDialogButton.title" defaultMessage="Help" />,
        dialogDescription,
        icon = <QuestionMark />,
        slotProps = {},
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminHelpDialogButton" });
    const [showHelp, setShowHelp] = useState(false);

    return (
        <Root {...slotProps?.root} {...restProps}>
            <HelpButton
                onClick={() => {
                    setShowHelp(!showHelp);
                }}
                {...slotProps?.button}
            >
                {icon}
            </HelpButton>
            <HelpDialog
                open={showHelp}
                onClose={() => {
                    setShowHelp(false);
                }}
                title={dialogTitle}
                {...slotProps?.dialog}
            >
                <HelpDialogContent {...slotProps?.dialogContent}>{dialogDescription}</HelpDialogContent>
            </HelpDialog>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminHelpDialogButton: HelpDialogButtonProps;
    }

    interface ComponentNameToClassKey {
        CometAdminHelpDialogButton: HelpDialogButtonClassKey;
    }

    interface Components {
        CometAdminHelpDialogButton?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminHelpDialogButton"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminHelpDialogButton"];
        };
    }
}
