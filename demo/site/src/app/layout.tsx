import { SitePreviewProvider } from "@comet/cms-site";
import StyledComponentsRegistry from "@src/util/StyledComponentsRegistry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";

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
                <StyledComponentsRegistry>
                    {draftMode().isEnabled ? <SitePreviewProvider>{children}</SitePreviewProvider> : children}
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
