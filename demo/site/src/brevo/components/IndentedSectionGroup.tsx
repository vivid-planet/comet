import { css } from "@comet/mail-react";
import { MjmlGroup, MjmlSection, MjmlStyle } from "@faire/mjml-react";
import { theme } from "@src/brevo/util/theme";
import clsx from "clsx";
import { type ComponentProps, type ReactNode } from "react";

interface IndentedSectionGroupProps extends ComponentProps<typeof MjmlSection> {
    children?: ReactNode;
    cssClass?: string;
}

export const indentedSectionGroupStyles = (
    <MjmlStyle>{css`
        @media (max-width: ${theme.mailSize.contentWidth - 1}px) {
            .indented-section__group {
                width: 100% !important;
                max-width: ${theme.mailSize.contentWidth};
            }
        }
    `}</MjmlStyle>
);

export const IndentedSectionGroup = ({ children, cssClass, ...restProps }: IndentedSectionGroupProps) => {
    return (
        <MjmlSection
            cssClass={clsx("indented-section", cssClass)}
            paddingLeft={theme.mailSize.contentSpacing}
            paddingRight={theme.mailSize.contentSpacing}
            backgroundColor={theme.colors.background.content}
            {...restProps}
        >
            <MjmlGroup cssClass="indented-section__group">{children}</MjmlGroup>
        </MjmlSection>
    );
};
