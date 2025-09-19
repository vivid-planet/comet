// import "@comet/site-nextjs/css";

// import "@src/styles/global.scss";
import { CookieApiProvider, useLocalStorageCookieApi, useOneTrustCookieApi as useProductionCookieApi } from "@comet/site-nextjs";
import { DebugPage } from "@src/app/debug-separate-components/DebugPage";
import StyledComponentsRegistry from "@src/util/StyledComponentsRegistry";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import { type PropsWithChildren } from "react";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Comet Demo Site",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
    return (
        <html>
            <body>
                <CookieApiProvider api={process.env.NODE_ENV === "development" ? useLocalStorageCookieApi : useProductionCookieApi}>
                    <StyledComponentsRegistry>
                        <DebugPage />
                    </StyledComponentsRegistry>
                </CookieApiProvider>
            </body>
        </html>
    );
}
