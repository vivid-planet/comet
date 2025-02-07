import { IntlProvider } from "@src/util/IntlProvider";
import { loadMessages } from "@src/util/loadMessages";
import { setNotFoundContext } from "@src/util/NotFoundContext";
import { PropsWithChildren } from "react";

export default async function Page({ children, params: { domain, language } }: PropsWithChildren<{ params: { domain: string; language: string } }>) {
    setNotFoundContext({ domain, language });

    const messages = await loadMessages(language);
    return (
        <IntlProvider locale={language} messages={messages}>
            {children}
        </IntlProvider>
    );
}
