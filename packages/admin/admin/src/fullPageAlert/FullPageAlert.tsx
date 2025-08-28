import { CometDigitalExperienceLogo, Error, Info, Warning } from "@comet/admin-icons";
import { type ComponentsOverrides, type Divider, type Theme, type Typography, useThemeProps } from "@mui/material";
import { type FunctionComponent, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "../common/buttons/Button";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { InlineAlert, type InlineAlertSeverity } from "../inlineAlert/InlineAlert";
import { ActionContainer, ContentContainer, DetailDescription, DividerStyled, LogoContainer, Root, Title } from "./FullPageAlert.styles";

export type FullPageAlertClassKey = "root" | "title" | "info" | "contentContainer" | "divider" | "logoContainer" | "actionContainer";

type FullPageAlertSeverity = InlineAlertSeverity;

export type FullPageAlertProps = ThemedComponentBaseProps<{
    root: "div";
    contentContainer: "div";
    iconContainer: "div";
    divider: typeof Divider;
    title: typeof Typography;
    detailDescription: typeof Typography;
    logoContainer: "div";
    actionContainer: "div";
}> & {
    logo?: ReactNode;
    icon?: ReactNode;
    iconMapping?: Partial<Record<FullPageAlertSeverity, ReactNode>>;
    title?: ReactNode;
    titleMapping?: Partial<Record<FullPageAlertSeverity, ReactNode>>;
    description?: ReactNode;
    descriptionMapping?: Partial<Record<FullPageAlertSeverity, ReactNode>>;
    detailDescription?: ReactNode;
    detailDescriptionMapping?: Partial<Record<FullPageAlertSeverity, ReactNode>>;
    actions?: ReactNode;
    severity?: FullPageAlertSeverity;
};

const defaultIconMapping: Record<FullPageAlertSeverity, ReactNode> = {
    error: <Error sx={{ fontSize: "48px" }} color="error" />,
    warning: <Warning sx={{ fontSize: "48px" }} color="warning" />,
    info: <Info sx={{ fontSize: "48px" }} color="info" />,
};

const defaultTitleMapping: Record<FullPageAlertSeverity, ReactNode> = {
    error: <FormattedMessage id="comet.fullPageAlert.error.title" defaultMessage="Something went wrong" />,
    warning: <FormattedMessage id="comet.fullPageAlert.warning.title" defaultMessage="Warning" />,
    info: <FormattedMessage id="comet.fullPageAlert.info.title" defaultMessage="Info" />,
};

const defaultDescriptionMapping: Record<FullPageAlertSeverity, ReactNode> = {
    error: <FormattedMessage id="comet.fullPageAlert.error.description" defaultMessage="An unexpected error occurred." />,
    warning: null,
    info: null,
};

const defaultDetailDescriptionMapping: Record<FullPageAlertSeverity, ReactNode> = {
    error: (
        <FormattedMessage
            id="comet.fullPageAlert.error.detailDescription"
            defaultMessage="Please check the URL for typos, or use the button below to return to the homepage. If the issue persists, contact our support team."
        />
    ),
    warning: null,
    info: null,
};

export const FullPageAlert: FunctionComponent<FullPageAlertProps> = (inProps) => {
    const {
        severity = "error",
        title: _title,
        titleMapping: passedTitleMapping = {},
        description,
        descriptionMapping: passedDescriptionMapping = {},
        icon,
        iconMapping: passedIconMapping = {},
        detailDescription: _detailDescription,
        detailDescriptionMapping: passedDetailDescriptionMapping = {},
        logo = <CometDigitalExperienceLogo sx={{ width: "100%", height: "30px" }} />,
        actions = (
            <Button href="/" fullWidth>
                <FormattedMessage id="comet.fullPageAlert.action.returnToHomePage" defaultMessage="Return to home page" />
            </Button>
        ),
        sx,
        className,
        slotProps = {},
    } = useThemeProps({ props: inProps, name: "CometAdminFullPageAlert" });

    const iconMapping = { ...defaultIconMapping, ...passedIconMapping };
    const titleMapping = { ...defaultTitleMapping, ...passedTitleMapping };
    const descriptionMapping = { ...defaultDescriptionMapping, ...passedDescriptionMapping };
    const detailDescriptionMapping = { ...defaultDetailDescriptionMapping, ...passedDetailDescriptionMapping };

    const title = _title ?? titleMapping[severity];
    const detailDescription = _detailDescription ?? detailDescriptionMapping[severity];

    return (
        <Root sx={sx} className={className} {...slotProps.root}>
            <ContentContainer {...slotProps.contentContainer}>
                <InlineAlert
                    title={
                        <Title variant="h3" {...slotProps.title}>
                            {title}
                        </Title>
                    }
                    titleMapping={titleMapping}
                    description={description}
                    descriptionMapping={descriptionMapping}
                    iconMapping={iconMapping}
                    icon={icon}
                    severity={severity}
                />

                {detailDescription && (
                    <>
                        <DividerStyled {...slotProps.divider} />
                        <DetailDescription variant="body2" {...slotProps.detailDescription}>
                            {detailDescription}
                        </DetailDescription>
                    </>
                )}
                {(logo || actions) && <DividerStyled {...slotProps.divider} />}
                {logo && <LogoContainer {...slotProps.logoContainer}>{logo}</LogoContainer>}
                {actions && <ActionContainer {...slotProps.actionContainer}>{actions}</ActionContainer>}
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
