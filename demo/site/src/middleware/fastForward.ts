import { NextRequest, NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";

export function withFastForwardMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const pathname = request.nextUrl.pathname;
        if (pathname.startsWith("/block-preview/") || pathname === "/robots.txt" || pathname.startsWith("/api/")) {
            // don't apply any other middlewares
            return NextResponse.next();
        }
        return middleware(request);
    };
}
