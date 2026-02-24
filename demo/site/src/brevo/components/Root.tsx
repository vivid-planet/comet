import {
    css,
    Mjml,
    MjmlAttributes,
    MjmlBody,
    MjmlConditionalComment,
    MjmlDivider,
    MjmlHead,
    MjmlSection,
    MjmlStyle,
    MjmlText,
    MjmlTitle,
} from "@comet/mail-react";
import { theme } from "@src/brevo/util/theme";
import { type FC, type PropsWithChildren } from "react";

import { indentedSectionGroupStyles } from "./IndentedSectionGroup";

type Props = PropsWithChildren<{
    title?: string;
}>;

// Fix for Outlook, which cannot load font-face and fails to use the correct fallback-font automatically.
const outlookFontFixStyles = (
    <MjmlStyle>{css`
        div,
        span,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        p,
        a,
        b {
            font-family: Helvetica, Arial, sans-serif !important;
        }
    `}</MjmlStyle>
);

export const Root: FC<Props> = ({ children, title }) => {
    return (
        <Mjml>
            <MjmlHead>
                <MjmlAttributes>
                    <MjmlText padding={0} />
                    <MjmlDivider padding={0} />
                    <MjmlSection padding={0} />
                </MjmlAttributes>
                {!!title && <MjmlTitle>{title}</MjmlTitle>}
                {indentedSectionGroupStyles}
                <MjmlConditionalComment condition="if mso">{outlookFontFixStyles}</MjmlConditionalComment>
            </MjmlHead>
            <MjmlBody width={theme.mailSize.contentWidth}>{children}</MjmlBody>
        </Mjml>
    );
};
