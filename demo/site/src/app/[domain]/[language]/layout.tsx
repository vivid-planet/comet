import { IntlProvider } from "@src/util/IntlProvider";
import { loadMessages } from "@src/util/loadMessages";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import { PropsWithChildren } from "react";

export default async function Page({ children, params: { domain, language } }: PropsWithChildren<{ params: { domain: string; language: string } }>) {
    const siteConfig = getSiteConfigForDomain(domain);
    if (!siteConfig.scope.languages.includes(language)) {
        language = "en";
    }

    const messages = await loadMessages(language);
    return (
        <IntlProvider locale={language} messages={messages}>
            {children}
        </IntlProvider>
    );
}
