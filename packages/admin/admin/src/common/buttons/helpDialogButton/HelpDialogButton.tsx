import { QuestionMark } from "@comet/admin-icons";
import { type ComponentsOverrides, type DialogContent, type IconButton, type Theme, useThemeProps } from "@mui/material";
import { type FunctionComponent, type ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";

import { type ThemedComponentBaseProps } from "../../../helpers/ThemedComponentBaseProps";
import { type Dialog } from "../../Dialog";
import { HelpButton, HelpDialog, HelpDialogContent } from "./HelpDialogButton.sc";

export type HelpDialogButtonClassKey = "button" | "dialog" | "dialogContent";

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
        dialogTitle = <FormattedMessage id="comet.helpDialogButton.title" defaultMessage="Help" />,
        dialogDescription,
        icon = <QuestionMark />,
        slotProps = {},
        ...restProps
    } = useThemeProps({ props: inProps, name: "CometAdminHelpDialogButton" });
    const [showHelp, setShowHelp] = useState(false);

    return (
        <>
            <HelpButton
                onClick={() => {
                    setShowHelp(!showHelp);
                }}
                {...slotProps?.button}
                {...restProps}
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
        </>
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
