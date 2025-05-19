import { Button, InlineAlert, type ThemedComponentBaseProps } from "@comet/admin";
import { Error } from "@comet/admin-icons";
import { type ComponentsOverrides, type Divider, type Theme, type Typography, useThemeProps } from "@mui/material";
import { type FunctionComponent, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { CometDxpLogo } from "./CometDxpLogo";
import { ContentContainer, DividerStyled, Info, LogoContainer, Root, Title } from "./NotFound.styles";

export type NotFoundClassKey = "root" | "title" | "info" | "contentContainer" | "iconContainer" | "divider" | "logoContainer";

export type NotFoundProps = ThemedComponentBaseProps<{
    root: "div";
    contentContainer: "div";
    iconContainer: "div";
    divider: typeof Divider;
    title: typeof Typography;
    info: typeof Typography;
    logoContainer: "div";
}> & {
    logo?: ReactNode;
    icon?: ReactNode;
    title?: ReactNode;
    description?: ReactNode;
};

export const NotFound: FunctionComponent<NotFoundProps> = (inProps) => {
    const {
        title = <FormattedMessage id="comet.notFound.title" defaultMessage="Page not found (404)" />,
        description = <FormattedMessage id="comet.notFound.description" defaultMessage="The requested page does not exist or has been moved." />,
        icon = <Error sx={{ fontSize: "32px" }} color="error" />,
        logo = <CometDxpLogo />,
        sx,
        className,
        slotProps = {},
    } = useThemeProps({ props: inProps, name: "CometAdminNotFound" });

    return (
        <Root sx={sx} className={className}>
            <ContentContainer {...slotProps.contentContainer}>
                <InlineAlert title={<Title variant="h3">{title}</Title>} description={description} icon={icon} />
                <DividerStyled {...slotProps.divider} />
                <Info variant="body2" {...slotProps.info}>
                    <FormattedMessage
                        id="comet.notFound.info"
                        defaultMessage="It looks like you have come across a non-existent section of our application. Check the URL or return to the home page. If you thought this page should exist, please inform our support team."
                    />
                </Info>
                <DividerStyled {...slotProps.divider} />
                <LogoContainer {...slotProps.logoContainer}>{logo}</LogoContainer>
                <Button href="/" fullWidth>
                    <FormattedMessage id="comet.notFound.button.returnToHomePage" defaultMessage="Return to home page" />
                </Button>
            </ContentContainer>
        </Root>
    );
};

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminNotFound: NotFoundProps;
    }

    interface ComponentNameToClassKey {
        CometAdminNotFound: NotFoundClassKey;
    }

    interface Components {
        CometAdminNotFound?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminNotFound"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminNotFound"];
        };
    }
}
