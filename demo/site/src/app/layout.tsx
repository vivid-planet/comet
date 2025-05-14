import "@comet/site-next/css";

import { CookieApiProvider, useLocalStorageCookieApi, useOneTrustCookieApi as useProductionCookieApi } from "@comet/site-next";
import { GlobalStyle } from "@src/app/GlobalStyle";
import { ErrorHandler } from "@src/util/ErrorHandler";
import { ResponsiveSpacingStyle } from "@src/util/ResponsiveSpacingStyle";
import StyledComponentsRegistry from "@src/util/StyledComponentsRegistry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
                        <GlobalStyle />
                        <ResponsiveSpacingStyle />
                        <ErrorHandler>{children}</ErrorHandler>
                    </StyledComponentsRegistry>
                </CookieApiProvider>
            </body>
        </html>
    );
}
