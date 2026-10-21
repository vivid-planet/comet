import type { ContentScope } from "@src/site-configs";

export default function NotFound404({ scope }: { scope: ContentScope }) {
    return (
        <>
            <p>Page not found (Scope {JSON.stringify(scope)}).</p>
            <a href={`/${scope.language}`}>Return Home</a>
        </>
    );
}
