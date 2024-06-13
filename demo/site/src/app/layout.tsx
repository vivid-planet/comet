import { SitePreviewProvider } from "@comet/cms-site";
import StyledComponentsRegistry from "@src/util/StyledComponentsRegistry";
import { readFile } from "fs/promises";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";

import { IntlProvider } from "./IntlProvider";

const inter = Inter({ subsets: ["latin"] });

const messagesCache: Record<string, unknown> = {};
async function loadMessages(lang: string) {
    if (messagesCache[lang]) return messagesCache[lang];
    const path = `./lang-compiled/${lang}.json`;
    const messages = JSON.parse(await readFile(path, "utf8"));
    messagesCache[lang] = messages;
    return messages;
}

export const metadata: Metadata = {
    title: "Comet Demo Site",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Layout must not throw notFound() but getSiteConfig() might, so catch it here and render a basic 404
    // let siteConfig;
    // try {
    //     siteConfig = await getSiteConfig();
    // } catch (error) {
    //     if (error.message !== "NEXT_NOT_FOUND") throw error;
    //     return (
    //         <html>
    //             <body>{children}</body>
    //         </html>
    //     );
    // }

    const messages = await loadMessages("en");

    return (
        <html>
            <body className={inter.className}>
                <IntlProvider locale="en" messages={messages}>
                    <StyledComponentsRegistry>
                        {draftMode().isEnabled ? <SitePreviewProvider>{children}</SitePreviewProvider> : children}
                    </StyledComponentsRegistry>
                </IntlProvider>
            </body>
        </html>
    );
}
