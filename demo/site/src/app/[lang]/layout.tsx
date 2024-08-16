import { readFile } from "fs/promises";

import { IntlProvider } from "./IntlProvider";

const messagesCache: Record<string, unknown> = {};
async function loadMessages(lang: string) {
    if (messagesCache[lang]) return messagesCache[lang];
    const path = `./lang-compiled/${lang}.json`;
    const messages = JSON.parse(await readFile(path, "utf8"));
    messagesCache[lang] = messages;
    return messages;
}

export default async function Page({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
    const messages = await loadMessages(params.lang);
    return (
        <IntlProvider locale={params.lang} messages={messages}>
            {children}
        </IntlProvider>
    );
}
