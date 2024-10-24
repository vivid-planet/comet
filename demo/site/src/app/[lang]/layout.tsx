import { languages } from "@src/config";
import { readFile } from "fs/promises";
import { PropsWithChildren } from "react";

import { IntlProvider } from "./IntlProvider";

const messagesCache: Record<string, unknown> = {};
async function loadMessages(lang: string) {
    if (messagesCache[lang]) return messagesCache[lang];
    const path = `./lang-compiled/${lang}.json`;
    const messages = JSON.parse(await readFile(path, "utf8"));
    messagesCache[lang] = messages;
    return messages;
}

export default async function Page({ children, params }: PropsWithChildren<{ params: { lang: string } }>) {
    let language = params.lang;
    if (!languages.includes(language)) {
        language = "en";
    }
    const messages = await loadMessages(language);
    return (
        <IntlProvider locale={language} messages={messages}>
            {children}
        </IntlProvider>
    );
}
