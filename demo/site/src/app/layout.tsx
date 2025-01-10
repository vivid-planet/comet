import "@pigment-css/react/styles.css";
import "@src/util/ResponsiveSpacingStyling";

import { CookieApiProvider, useLocalStorageCookieApi, useOneTrustCookieApi as useProductionCookieApi } from "@comet/cms-site";
import { ErrorHandler } from "@src/util/ErrorHandler";
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
                    <ErrorHandler>{children}</ErrorHandler>
                </CookieApiProvider>
            </body>
        </html>
    );
}
