import { Error, Info, Warning } from "@comet/admin-icons";
import { type ComponentsOverrides, type Theme, type Typography, useTheme } from "@mui/material";
import { useThemeProps } from "@mui/material/styles";
import { type FunctionComponent, type PropsWithChildren, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { type ThemedComponentBaseProps } from "../../helpers/ThemedComponentBaseProps";
import { ActionsContainer, Description, IconContainer, Root, Title } from "./InlineError.styles";

export type InlineErrorClassKey = "root" | "iconContainer" | "title" | "description" | "actionsContainer";

type InlineErrorVariant = "error" | "warning" | "info";

type InlineErrorProps = ThemedComponentBaseProps<{
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
     * A mapping of descriptions for each error variant.
     */
    descriptionMapping?: Record<InlineErrorVariant, ReactNode>;

    /**
     * Custom icon to be displayed next to the error message.
     * If not provided, a default icon based on the variant will be used.
     */
    icon?: ReactNode;

    /**
     * A mapping of icons for each error variant.
     */
    iconMapping?: Record<InlineErrorVariant, ReactNode>;

    /**
     * Defines the type of error message displayed.
     * Variants include "error", "warning", and "info".
     *
     * @defaultValue "error"
     */
    variant?: InlineErrorVariant;

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
    titleMapping?: Record<InlineErrorVariant, ReactNode>;
};

/**
 * The InlineError component is used to display inline error messages within an application.
 * It provides visual feedback for errors, warnings, or informational messages with optional actions.
 */
export const InlineError: FunctionComponent<PropsWithChildren<InlineErrorProps>> = (inProps) => {
    const theme = useTheme();
    const {
        icon,
        iconMapping = {
            error: <Error sx={{ fontSize: "32px" }} htmlColor={theme.palette.error.main} />,
            warning: <Warning sx={{ fontSize: "32px" }} htmlColor={theme.palette.warning.main} />,
            info: <Info sx={{ fontSize: "32px" }} htmlColor={theme.palette.primary.main} />,
        },
        actions,
        variant = "error",
        title,
        titleMapping = {
            error: <FormattedMessage defaultMessage="Error" id="comet.inlineError.error.title" />,
            warning: <FormattedMessage defaultMessage="Warning" id="comet.inlineError.warning.title" />,
            info: <FormattedMessage defaultMessage="Info" id="comet.inlineError.info.title" />,
        },
        description,
        descriptionMapping = {
            error: (
                <FormattedMessage
                    defaultMessage="An error occurred. Please try again later or contact the support."
                    id="comet.inlineError.error.description"
                />
            ),
            warning: null,
            info: null,
        },
    } = useThemeProps({ props: inProps, name: "CometAdminInlineError" });

    return (
        <Root>
            <IconContainer>{icon ?? iconMapping[variant]}</IconContainer>

            <Title variant="h5">{title ?? titleMapping[variant]}</Title>

            <Description variant="body2">{description ?? descriptionMapping[variant]}</Description>

            {actions && <ActionsContainer>{actions}</ActionsContainer>}
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminInlineError: InlineErrorProps;
    }

    interface ComponentNameToClassKey {
        CometAdminInlineError: InlineErrorClassKey;
    }

    interface Components {
        CometAdminInlineError?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminInlineError"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminInlineError"];
        };
    }
}
