import { DextinityLogo } from "@dextinity/admin-icons";
import type { CardProps, TypographyProps } from "@dextinity/ui";
import type { ComponentProps, FunctionComponent, ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "../common/buttons/Button";
import type { InlineAlertProps, InlineAlertSeverity } from "../inlineAlert/InlineAlert";
import {
    ActionContainer,
    BackgroundStyled,
    ContentContainer,
    DetailDescription,
    DividerStyled,
    InlineAlertStyled,
    LargeIcon,
    LogoContainer,
    Root,
} from "./FullPageAlert.styles";

export type FullPageAlertClassKey =
    "root" | "background" | "detailDescription" | "contentContainer" | "divider" | "logoContainer" | "actionContainer" | "inlineAlert";

type FullPageAlertSeverity = InlineAlertSeverity;

export type FullPageAlertProps = {
    className?: string;
    slotProps?: {
        root?: Partial<ComponentProps<"div">>;
        contentContainer?: Partial<CardProps>;
        background?: { className?: string };
        divider?: Partial<ComponentProps<"hr">>;
        inlineAlert?: Partial<InlineAlertProps>;
        detailDescription?: Partial<TypographyProps>;
        logoContainer?: Partial<ComponentProps<"div">>;
        actionContainer?: Partial<ComponentProps<"div">>;
    };
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
    error: <LargeIcon name="danger" />,
    warning: <LargeIcon name="warning" />,
    info: <LargeIcon name="info" />,
};

const defaultTitleMapping: Record<FullPageAlertSeverity, ReactNode> = {
    error: <FormattedMessage id="dextinity.fullPageAlert.error.title" defaultMessage="Something went wrong" />,
    warning: <FormattedMessage id="dextinity.fullPageAlert.warning.title" defaultMessage="Warning" />,
    info: <FormattedMessage id="dextinity.fullPageAlert.info.title" defaultMessage="Info" />,
};

const defaultDescriptionMapping: Record<FullPageAlertSeverity, ReactNode> = {
    error: <FormattedMessage id="dextinity.fullPageAlert.error.description" defaultMessage="An unexpected error occurred." />,
    warning: null,
    info: null,
};

const defaultDetailDescriptionMapping: Record<FullPageAlertSeverity, ReactNode> = {
    error: (
        <FormattedMessage
            id="dextinity.fullPageAlert.error.detailDescription"
            defaultMessage="Please check the URL for typos, or use the button below to return to the homepage. If the issue persists, contact our support team."
        />
    ),
    warning: null,
    info: null,
};

export const FullPageAlert: FunctionComponent<FullPageAlertProps> = ({
    severity = "error",
    title: _title,
    titleMapping: passedTitleMapping = {},
    description,
    descriptionMapping: passedDescriptionMapping = {},
    icon,
    iconMapping: passedIconMapping = {},
    detailDescription: _detailDescription,
    detailDescriptionMapping: passedDetailDescriptionMapping = {},
    logo = <DextinityLogo fontSize="inherit" />,
    actions = (
        <Button href="/" fullWidth>
            <FormattedMessage id="dextinity.fullPageAlert.action.returnToHomePage" defaultMessage="Return to home page" />
        </Button>
    ),
    className,
    slotProps = {},
}) => {
    const iconMapping = { ...defaultIconMapping, ...passedIconMapping };
    const titleMapping = { ...defaultTitleMapping, ...passedTitleMapping };
    const descriptionMapping = { ...defaultDescriptionMapping, ...passedDescriptionMapping };
    const detailDescriptionMapping = { ...defaultDetailDescriptionMapping, ...passedDetailDescriptionMapping };

    const title = _title ?? titleMapping[severity];
    const detailDescription = _detailDescription ?? detailDescriptionMapping[severity];

    return (
        <Root className={className} {...slotProps.root}>
            <BackgroundStyled {...slotProps.background} />
            <ContentContainer {...slotProps.contentContainer}>
                <InlineAlertStyled
                    title={title}
                    titleMapping={titleMapping}
                    description={description}
                    descriptionMapping={descriptionMapping}
                    iconMapping={iconMapping}
                    icon={icon}
                    severity={severity}
                    slotProps={{
                        title: {
                            variant: "heading2",
                        },
                    }}
                    {...slotProps.inlineAlert}
                />

                {detailDescription && (
                    <>
                        <DividerStyled {...slotProps.divider} />
                        <DetailDescription {...slotProps.detailDescription}>{detailDescription}</DetailDescription>
                    </>
                )}
                {(logo || actions) && <DividerStyled {...slotProps.divider} />}
                {logo && <LogoContainer {...slotProps.logoContainer}>{logo}</LogoContainer>}
                {actions && <ActionContainer {...slotProps.actionContainer}>{actions}</ActionContainer>}
            </ContentContainer>
        </Root>
    );
};
