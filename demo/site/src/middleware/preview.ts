import { type NextRequest, NextResponse } from "next/server";

import { type CustomMiddleware } from "./chain";

export function withPreviewMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        if (request.nextUrl.pathname.startsWith("/block-preview/") || request.nextUrl.pathname === "/site-preview") {
            // don't apply any other middlewares
            return NextResponse.next();
        }
        return middleware(request);
    };
}
