import { type PropsWithChildren } from "react";

export default function NotFound404({ children }: PropsWithChildren) {
    return (
        <>
            <h1>404 - Page Not Found</h1>
            {children}
        </>
    );
}
