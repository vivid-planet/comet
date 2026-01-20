import { Mjml, MjmlAttributes, MjmlBody, MjmlHead, MjmlSection, MjmlText } from "@faire/mjml-react";
import messages_de from "@src/../lang-compiled/comet-demo-api/de.json";
import messages_en from "@src/../lang-compiled/comet-demo-api/en.json";
import { type PropsWithChildren } from "react";
import { IntlProvider, type ResolvedIntlConfig } from "react-intl";

export const getMessages = (language: string): ResolvedIntlConfig["messages"] => {
    if (language === "de") {
        return messages_de;
    }

    return messages_en;
};

type Props = PropsWithChildren<{
    locale: string;
}>;

export const MailRoot = ({ children, locale }: Props) => {
    return (
        <IntlProvider locale={locale} messages={getMessages(locale)}>
            <Mjml>
                <MjmlHead>
                    <MjmlAttributes>
                        <MjmlText padding={0} fontFamily="Arial, sans-serif" />
                        <MjmlSection padding={0} />
                    </MjmlAttributes>
                </MjmlHead>
                <MjmlBody width={600} backgroundColor="#F2F2F2">
                    {children}
                </MjmlBody>
            </Mjml>
        </IntlProvider>
    );
};
