import Link from "next/link";

export default async function NotFound404(): Promise<JSX.Element> {
    return (
        <html lang="en">
            <body>
                <p>Page not found.</p>
                <Link href="/">Return Home</Link>
            </body>
        </html>
    );
}
