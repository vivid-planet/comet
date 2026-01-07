import { css } from "@comet/mail-react";
import { Mjml, MjmlAttributes, MjmlBody, MjmlDivider, MjmlHead, MjmlSection, MjmlText, MjmlTitle } from "@faire/mjml-react";
import { MjmlConditionalComment } from "@faire/mjml-react/extensions";
import { theme } from "@src/brevo/util/theme";
import { type FC, type PropsWithChildren } from "react";
import { renderToString } from "react-dom/server";

import { indentedSectionGroupStyles } from "./IndentedSectionGroup";

type Props = PropsWithChildren<{
    title?: string;
}>;

// Fix for Outlook, which cannot load font-face and failes to use the correct fallback-font automatically.
const outlookFontFixStyleString = renderToString(
    <style type="text/css">{css`
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
    `}</style>,
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
                <MjmlConditionalComment condition="if mso">{outlookFontFixStyleString}</MjmlConditionalComment>
            </MjmlHead>
            <MjmlBody width={theme.mailSize.contentWidth}>{children}</MjmlBody>
        </Mjml>
    );
};
