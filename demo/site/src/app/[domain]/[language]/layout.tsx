import { IntlProvider } from "@src/util/IntlProvider";
import { loadMessages } from "@src/util/loadMessages";
import { setNotFoundContext } from "@src/util/ServerContext";
import { decodePageProps } from "@src/util/siteConfig";
import { PropsWithChildren } from "react";

export default async function Page(props: PropsWithChildren<{ params: { domain: string; language: string } }>) {
    const { children, params, siteConfig } = decodePageProps(props);
    let language = params.language;
    if (!siteConfig.scope.languages.includes(language)) {
        language = "en";
    }
    setNotFoundContext({ domain: params.domain, language });

    const messages = await loadMessages(language);
    return (
        <IntlProvider locale={language} messages={messages}>
            {children}
        </IntlProvider>
    );
}
