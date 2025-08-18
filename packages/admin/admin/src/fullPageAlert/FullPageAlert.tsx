import { Error } from "@comet/admin-icons";
import { type ComponentsOverrides, type Divider, type Theme, type Typography, useThemeProps } from "@mui/material";
import { type FunctionComponent, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "../common/buttons/Button";
import { CometLogo } from "../common/CometLogo";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { InlineAlert } from "../inlineAlert/InlineAlert";
import { ActionContainer, ContentContainer, DividerStyled, Info, LogoContainer, Root, Title } from "./FullPageAlert.styles";

export type FullPageAlertClassKey = "root" | "title" | "info" | "contentContainer" | "divider" | "logoContainer" | "actionContainer";

export type FullPageAlertProps = ThemedComponentBaseProps<{
    root: "div";
    contentContainer: "div";
    iconContainer: "div";
    divider: typeof Divider;
    title: typeof Typography;
    info: typeof Typography;
    logoContainer: "div";
    actionContainer: "div";
}> & {
    logo?: ReactNode;
    icon?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
    help?: ReactNode;
    actions?: ReactNode;
};

export const FullPageAlert: FunctionComponent<FullPageAlertProps> = (inProps) => {
    const {
        title = <FormattedMessage id="comet.errorPage.title" defaultMessage="Something went wrong" />,
        description = <FormattedMessage id="comet.errorPage.description" defaultMessage="An unexpected error occurred." />,
        icon = <Error sx={{ fontSize: "48px" }} color="error" />,
        logo = <CometLogo />,
        help = (
            <FormattedMessage
                id="comet.errorPage.info"
                defaultMessage="Please check the URL for typos, or use the button below to return to the homepage. If the issue persists, contact our support team."
            />
        ),
        actions = (
            <Button href="/" fullWidth>
                <FormattedMessage id="comet.notFound.button.returnToHomePage" defaultMessage="Return to home page" />
            </Button>
        ),
        sx,
        className,
        slotProps = {},
    } = useThemeProps({ props: inProps, name: "CometAdminFullPageAlert" });
    return (
        <Root sx={sx} className={className} {...slotProps.root}>
            <ContentContainer {...slotProps.contentContainer}>
                <InlineAlert title={<Title variant="h3">{title}</Title>} description={description} icon={icon} />
                <DividerStyled {...slotProps.divider} />
                <Info variant="body2" {...slotProps.info}>
                    {help}
                </Info>
                <DividerStyled {...slotProps.divider} />
                <LogoContainer {...slotProps.logoContainer}>{logo}</LogoContainer>

                <ActionContainer {...slotProps.actionContainer}>{actions}</ActionContainer>
            </ContentContainer>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminFullPageAlert: FullPageAlertProps;
    }

    interface ComponentNameToClassKey {
        CometAdminFullPageAlert: FullPageAlertClassKey;
    }

    interface Components {
        CometAdminFullPageAlert?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminFullPageAlert"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminFullPageAlert"];
        };
    }
}
