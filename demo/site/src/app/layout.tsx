import { CookieApiProvider, SitePreviewProvider, useLocalStorageCookieApi, useOneTrustCookieApi as useProductionCookieApi } from "@comet/cms-site";
import { ErrorHandler } from "@src/util/ErrorHandler";
import StyledComponentsRegistry from "@src/util/StyledComponentsRegistry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Comet Demo Site",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
    return (
        <html>
            <body className={inter.className}>
                <CookieApiProvider api={process.env.NODE_ENV === "development" ? useLocalStorageCookieApi : useProductionCookieApi}>
                    <StyledComponentsRegistry>
                        <ErrorHandler>{draftMode().isEnabled ? <SitePreviewProvider>{children}</SitePreviewProvider> : children}</ErrorHandler>
                    </StyledComponentsRegistry>
                </CookieApiProvider>
            </body>
        </html>
    );
}
