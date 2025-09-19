import { type PropsWithChildren } from "react";

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
