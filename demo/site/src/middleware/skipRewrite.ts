import { type NextRequest, NextResponse } from "next/server";

import { type CustomMiddleware } from "./chain";

export function withSkipRewriteMiddleware(middleware: CustomMiddleware) {
<<<<<<< HEAD
    const skipFiles = ["/favicon.ico", "/apple-icon.png", "/icon.svg", "/manifest.json", "/robots.txt"];
=======
    const skipFiles = ["/favicon.ico", "/apple-icon.png", "/icon.svg", "/manifest.json"];
>>>>>>> main
    const skipPaths = ["/_next/static/", "/_next/image/", "/assets/"];

    return async (request: NextRequest) => {
        if (skipFiles.some((file) => request.nextUrl.pathname === file)) {
            return NextResponse.next();
        }

        if (skipPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
            return NextResponse.next();
        }

        return middleware(request);
    };
}
