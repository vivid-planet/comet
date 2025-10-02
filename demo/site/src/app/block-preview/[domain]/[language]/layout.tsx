import { IntlProvider } from "@src/util/IntlProvider";
import { loadMessages } from "@src/util/loadMessages";
import { type PropsWithChildren } from "react";

type Params = Promise<{ language: string }>;

export default async function Page({ children, params }: PropsWithChildren<{ params: Params }>) {
    const { language } = await params;
    const messages = await loadMessages(language);
    return (
        <IntlProvider locale={language} messages={messages}>
            {children}
        </IntlProvider>
    );
}
