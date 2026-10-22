import { Icon, type TypographyProps } from "@dextinity/ui";
import type { ComponentProps, FunctionComponent, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { ActionsContainer, Description, IconContainer, Root, Title } from "./InlineAlert.sc";

export type InlineAlertClassKey = "root" | "iconContainer" | "title" | "description" | "actionsContainer";

export type InlineAlertSeverity = "error" | "warning" | "info";

export type InlineAlertProps = {
    className?: string;
    slotProps?: {
        root?: Partial<ComponentProps<"div">>;
        iconContainer?: Partial<ComponentProps<"div">>;
        title?: Partial<TypographyProps>;
        description?: Partial<TypographyProps>;
        actionsContainer?: Partial<ComponentProps<"div">>;
    };

    /**
     * A description providing more details.
     */
    description?: ReactNode;

    /**
     * A mapping of descriptions for each severity option.
     */
    descriptionMapping?: Partial<Record<InlineAlertSeverity, ReactNode>>;

    /**
     * Custom icon to be displayed next to the error message.
     * If not provided, a default icon based on the variant will be used.
     */
    icon?: ReactNode;

    /**
     * A mapping of icons for each severity option.
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
     * The actions are shown below the description.
     */
    actions?: ReactNode;

    /**
     * The title of the alert.
     */
    title?: ReactNode;

    /**
     * A mapping of titles for each severity option.
     */
    titleMapping?: Partial<Record<InlineAlertSeverity, ReactNode>>;
};

const defaultIconMapping: Record<InlineAlertSeverity, ReactNode> = {
    error: <Icon name="danger" />,
    warning: <Icon name="warning" />,
    info: <Icon name="info" />,
};

const defaultTitleMapping: Record<InlineAlertSeverity, ReactNode> = {
    error: <FormattedMessage defaultMessage="Error" id="dextinity.inlineAlert.error.title" />,
    warning: <FormattedMessage defaultMessage="Warning" id="dextinity.inlineAlert.warning.title" />,
    info: <FormattedMessage defaultMessage="Info" id="dextinity.inlineAlert.info.title" />,
};

const defaultDescriptionMapping: Record<InlineAlertSeverity, ReactNode> = {
    error: (
        <FormattedMessage
            defaultMessage="An error occurred. Please try again later or contact the support."
            id="dextinity.inlineAlert.error.description"
        />
    ),
    warning: null,
    info: null,
};

/**
 * The InlineAlert component is used to display inline error messages within an application.
 * It provides visual feedback for errors, warnings, or informational messages with optional actions.
 */
export const InlineAlert: FunctionComponent<InlineAlertProps> = ({
    icon,
    iconMapping: passedIconMapping = {},
    actions,
    severity = "error",
    title,
    titleMapping: passedTitleMapping = {},
    description: _description,
    descriptionMapping: passedDescriptionMapping = {},
    className,
    slotProps = {},
}) => {
    const iconMapping = { ...defaultIconMapping, ...passedIconMapping };
    const titleMapping = { ...defaultTitleMapping, ...passedTitleMapping };
    const descriptionMapping = { ...defaultDescriptionMapping, ...passedDescriptionMapping };

    const description = _description ?? descriptionMapping[severity];

    return (
        <Root className={className} {...slotProps.root}>
            <IconContainer ownerState={{ severity }} {...slotProps.iconContainer}>
                {icon ?? iconMapping[severity]}
            </IconContainer>
            <Title variant="heading4" {...slotProps.title}>
                {title ?? titleMapping[severity]}
            </Title>
            {Boolean(description) && (
                <Description tone="muted" {...slotProps.description}>
                    {description}
                </Description>
            )}
            {actions && <ActionsContainer {...slotProps.actionsContainer}>{actions}</ActionsContainer>}
        </Root>
    );
};
