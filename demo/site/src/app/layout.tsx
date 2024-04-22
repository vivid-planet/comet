import { SitePreviewProvider } from "@comet/cms-site";
import StyledComponentsRegistry from "@src/util/StyledComponentsRegistry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import { Fragment } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Comet Demo Site",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const SitePreviewWrapper = draftMode().isEnabled ? SitePreviewProvider : Fragment;
    return (
        <html>
            <body className={inter.className}>
                <StyledComponentsRegistry>
                    <SitePreviewWrapper>{children}</SitePreviewWrapper>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
