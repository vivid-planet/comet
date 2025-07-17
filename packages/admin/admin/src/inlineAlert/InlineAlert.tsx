import { Error, Info, Warning } from "@comet/admin-icons";
import { type ComponentsOverrides, type Theme, type Typography } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import { type FunctionComponent, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { ActionsContainer, Description, IconContainer, Root, Title } from "./InlineAlert.sc";

export type InlineAlertClassKey = "root" | "iconContainer" | "title" | "description" | "actionsContainer";

type InlineAlertSeverity = "error" | "warning" | "info";

export type InlineAlertProps = ThemedComponentBaseProps<{
    root: "div";
    iconContainer: "div";
    title: typeof Typography;
    description: typeof Typography;
    actionsContainer: "div";
}> & {
    /**
     * A description message providing more details about the error.
     */
    description?: ReactNode;

    /**
     * A mapping of descriptions for each severity.
     */
    descriptionMapping?: Partial<Record<InlineAlertSeverity, ReactNode>>;

    /**
     * Custom icon to be displayed next to the error message.
     * If not provided, a default icon based on the variant will be used.
     */
    icon?: ReactNode;

    /**
     * A mapping of icons for each error variant.
     */
    iconMapping?: Partial<Record<InlineAlertSeverity, ReactNode>>;

    /**
     * Defines the type of error message displayed.
     * Variants include "error", "warning", and "info".
     *
     * @defaultValue "error"
     */
    severity?: InlineAlertSeverity;

    /**
     * Action elements such as buttons or links that allow users to take corrective action.
     * The actions are shown below the error message.
     */
    actions?: ReactNode;

    /**
     * The title of the error message.
     */
    title?: ReactNode;

    /**
     * A mapping of titles for each error variant.
     */
    titleMapping?: Partial<Record<InlineAlertSeverity, ReactNode>>;
};

const defaultIconMapping: Record<InlineAlertSeverity, ReactNode> = {
    error: <Error sx={{ fontSize: "32px" }} color="error" />,
    warning: <Warning sx={{ fontSize: "32px" }} color="warning" />,
    info: <Info sx={{ fontSize: "32px" }} color="info" />,
};

const defaultTitleMapping: Record<InlineAlertSeverity, ReactNode> = {
    error: <FormattedMessage defaultMessage="Error" id="comet.inlineAlert.error.title" />,
    warning: <FormattedMessage defaultMessage="Warning" id="comet.inlineAlert.warning.title" />,
    info: <FormattedMessage defaultMessage="Info" id="comet.inlineAlert.info.title" />,
};

const defaultDescriptionMapping: Record<InlineAlertSeverity, ReactNode> = {
    error: (
        <FormattedMessage
            defaultMessage="An error occurred. Please try again later or contact the support."
            id="comet.inlineAlert.error.description"
        />
    ),
    warning: null,
    info: null,
};

/**
 * The InlineAlert component is used to display inline error messages within an application.
 * It provides visual feedback for errors, warnings, or informational messages with optional actions.
 */
export const InlineAlert: FunctionComponent<InlineAlertProps> = (inProps) => {
    const {
        icon,
        iconMapping: passedIconMapping = {},
        actions,
        severity = "error",
        title,
        titleMapping: passedTitleMapping = {},
        description: _description,
        descriptionMapping: passedDescriptionMapping = {},
        sx,
        className,
        slotProps = {},
    } = useThemeProps({ props: inProps, name: "CometAdminInlineAlert" });

    const iconMapping = { ...defaultIconMapping, ...passedIconMapping };
    const titleMapping = { ...defaultTitleMapping, ...passedTitleMapping };
    const descriptionMapping = { ...defaultDescriptionMapping, ...passedDescriptionMapping };

    const description = _description ?? descriptionMapping[severity];

    return (
        <Root sx={sx} className={className} {...slotProps.root}>
            <IconContainer {...slotProps.iconContainer}>{icon ?? iconMapping[severity]}</IconContainer>
            <Title variant="h5" {...slotProps.title}>
                {title ?? titleMapping[severity]}
            </Title>
            {Boolean(description) && (
                <Description variant="body2" {...slotProps.description}>
                    {description}
                </Description>
            )}
            {actions && <ActionsContainer {...slotProps.actionsContainer}>{actions}</ActionsContainer>}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminInlineAlert: InlineAlertProps;
    }

    interface ComponentNameToClassKey {
        CometAdminInlineAlert: InlineAlertClassKey;
    }

    interface Components {
        CometAdminInlineAlert?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminInlineAlert"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminInlineAlert"];
        };
    }
}
