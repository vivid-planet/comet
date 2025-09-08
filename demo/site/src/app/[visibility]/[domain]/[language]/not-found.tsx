import { getNotFoundContext } from "@src/util/ServerContext";

export default async function NotFound404(): Promise<JSX.Element> {
    const scope = getNotFoundContext() || { domain: "main", language: "en" };

    return (
        <html lang={scope.language}>
            <body>
                <p>Page not found (Scope {JSON.stringify(scope)}).</p>
                <a href={`/${scope.language}`}>Return Home</a>
            </body>
        </html>
    );
}
