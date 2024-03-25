import { IntlProvider } from "@src/util/IntlProvider";
import StyledComponentsRegistry from "@src/util/StyledComponentsRegistry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Comet Demo Site",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body className={inter.className}>
                <IntlProvider>
                    <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
                </IntlProvider>
            </body>
        </html>
    );
}
