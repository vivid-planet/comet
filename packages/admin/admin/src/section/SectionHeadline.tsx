import { Info } from "@comet/admin-icons";
import { type ComponentsOverrides, Divider, Typography } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { isValidElement, type ReactNode } from "react";

import { Tooltip } from "../common/Tooltip";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type SectionHeadlineClassKey = "root" | "header" | "titleContainer" | "headline" | "divider" | "supportText" | "infoTooltip";

const Root = createComponentSlot("div")<SectionHeadlineClassKey>({
    componentName: "SectionHeadline",
    slotName: "root",
})();

const Header = createComponentSlot("div")<SectionHeadlineClassKey>({
    componentName: "SectionHeadline",
    slotName: "header",
})(
    () => css`
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
    `,
);

const TitleContainer = createComponentSlot("div")<SectionHeadlineClassKey>({
    componentName: "SectionHeadline",
    slotName: "titleContainer",
})(
    () => css`
        display: flex;
        align-items: center;
    `,
);

const Headline = createComponentSlot(Typography)<SectionHeadlineClassKey>({
    componentName: "SectionHeadline",
    slotName: "headline",
})();

const SupportText = createComponentSlot(Typography)<SectionHeadlineClassKey>({
    componentName: "SectionHeadline",
    slotName: "supportText",
})(
    ({ theme }) => css`
        color: ${theme.palette.text.secondary};
    `,
);

const InfoTooltip = createComponentSlot(Tooltip)<SectionHeadlineClassKey>({
    componentName: "SectionHeadline",
    slotName: "infoTooltip",
})(
    ({ theme }) => css`
        color: ${theme.palette.text.secondary};
        margin-left: 10px;
        font-size: 12px;
    `,
);

const StyledDivider = createComponentSlot(Divider)<SectionHeadlineClassKey>({
    componentName: "SectionHeadline",
    slotName: "divider",
})(
    () => css`
        margin-top: 10px;
    `,
);

export interface SectionHeadlineProps
    extends ThemedComponentBaseProps<{
        root: "div";
        header: "div";
        titleContainer: "div";
        infoTooltip: typeof Tooltip;
        supportText: typeof Typography;
        divider: typeof Divider;
    }> {
    children: ReactNode;
    divider?: boolean;
    supportText?: ReactNode;
    infoTooltip?: ReactNode;
    iconMapping?: {
        tooltip?: ReactNode;
    };
}

export function SectionHeadline(inProps: SectionHeadlineProps) {
    const {
        children,
        divider,
        supportText,
        infoTooltip,
        iconMapping = {},
        slotProps,
        ...restProps
    } = useThemeProps({
        props: inProps,
        name: "CometAdminSectionHeadline",
    });

    const { tooltip = <Info sx={{ fontSize: "inherit" }} /> } = iconMapping;

    return (
        <Root {...slotProps?.root} {...restProps}>
            <Header {...slotProps?.header}>
                <TitleContainer {...slotProps?.titleContainer}>
                    <Headline variant="h4">{children}</Headline>
                    {infoTooltip && tooltip && isValidElement(tooltip) && (
                        <InfoTooltip title={infoTooltip} {...slotProps?.infoTooltip}>
                            {tooltip}
                        </InfoTooltip>
                    )}
                </TitleContainer>

                {supportText && (
                    <SupportText variant="caption" {...slotProps?.supportText}>
                        {supportText}
                    </SupportText>
                )}
            </Header>

            {divider && <StyledDivider {...slotProps?.divider} />}
        </Root>
    );
}

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminSectionHeadline: SectionHeadlineClassKey;
    }

    interface ComponentsPropsList {
        CometAdminSectionHeadline: SectionHeadlineProps;
    }

    interface Components {
        CometAdminSectionHeadline?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminSectionHeadline"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminSectionHeadline"];
        };
    }
}
