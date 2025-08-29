import { Info } from "@comet/admin-icons";
import { type ComponentsOverrides, Divider, Typography } from "@mui/material";
import { css, type Theme, useThemeProps } from "@mui/material/styles";
import { type ReactNode } from "react";

import { Tooltip } from "../common/Tooltip";
import { createComponentSlot } from "../helpers/createComponentSlot";
import { type ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";

export type SectionHeadlineClassKey = "root" | "header" | "titleContainer" | "divider" | "supportText" | "infoTooltip" | "infoIcon";

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
    `,
);

const StyledDivider = createComponentSlot(Divider)<SectionHeadlineClassKey>({
    componentName: "SectionHeadline",
    slotName: "divider",
})(
    () => css`
        margin-top: 10px;
        color: "inherit";
    `,
);

const StyledInfoIcon = createComponentSlot(Info)<SectionHeadlineClassKey>({
    componentName: "SectionHeadline",
    slotName: "infoIcon",
})(
    () => css`
        font-size: 12px;
    `,
);

export interface SectionHeadlineProps
    extends ThemedComponentBaseProps<{
        root: "div";
        header: "div";
        titleContainer: "div";
        infoTooltip: typeof Tooltip;
        infoIcon: typeof Info;
        supportText: typeof Typography;
        divider: typeof Divider;
    }> {
    children: ReactNode;
    divider?: boolean;
    supportText?: string;
    infoTooltip?: string;
}

export function SectionHeadline(inProps: SectionHeadlineProps) {
    const { children, divider, supportText, infoTooltip, slotProps, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminSectionHeadline",
    });

    return (
        <Root {...slotProps?.root} {...restProps}>
            <Header {...slotProps?.header}>
                <TitleContainer {...slotProps?.titleContainer}>
                    {children}
                    {infoTooltip && (
                        <InfoTooltip title={infoTooltip} {...slotProps?.infoTooltip}>
                            <StyledInfoIcon {...slotProps?.infoIcon} />
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
