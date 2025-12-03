import { IntlProvider } from "@src/util/IntlProvider";
import { loadMessages } from "@src/util/loadMessages";
import { type PropsWithChildren } from "react";

export default async function Page({ children, params: { language } }: PropsWithChildren<{ params: { language: string } }>) {
    const messages = await loadMessages(language);
    return (
        <IntlProvider locale={language} messages={messages}>
            {children}
        </IntlProvider>
    );
}
